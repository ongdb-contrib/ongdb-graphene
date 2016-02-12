'use strict';

import Edge from './do/Edge';
import DataManager from './DataManager';
import InteractionManager from './InteractionManager';

/**
 * Private variables/consts
 */
const TRANSITION_DURATION = 100;

/**
 * @param entity
 * @returns {number}
 */
function getOpacityForEntity(entity) {
  if (entity.isNode) {
    const allSelectedEdges = DataManager.getAllEdges().filter(e => e.isSelected);

    for (let i = 0; i < allSelectedEdges.length; i++) {
      const nodeIsConnectedToSelectedEdge = [allSelectedEdges[i].endNodeID, allSelectedEdges[i].startNodeID].indexOf(entity.id) !== -1;

      if (nodeIsConnectedToSelectedEdge) {
        return 1;
      }
    }
  }

  if (entity.isSelected) {
    return 1;
  }

  // if the edge is starting from a selected node
  if (entity.isEdge && DataManager.getNode(entity.startNodeID).isSelected) {
    return 1;
  }

  // if there is no selected node nor edge
  if (!DataManager.isNodeSelected() && !DataManager.isEdgeSelected()) {
    return 1;
  }

  return 0.2;
}

// each edge need to have it's own arrow for pointing,
// so you can set different colors and opacity when selecting nodes and the edge itself
/**
 * @param edge
 */
function createOrUpdateArrowForEdge(edge) {
  const edgeColor = DataManager.getNode(edge.startNodeID).color;
  const arrowId = `end-arrow-${edge.id}`;

  // create an arrow
  if (document.querySelector(`#${arrowId}`) === null) {
    d3.select('defs')
      .append('marker').attr({
        id: arrowId
      })
      .append('path').attr({
        d: `M0,-5L10,0L0,5`
      });
  }

  // update an arrow
  d3.select(`#${arrowId}`).attr({
    fill: edgeColor,
    viewBox: '0 -5 10 10',
    refX: 20,
    markerWidth: 6,
    markerHeight: 6,
    orient: 'auto',
    opacity: getOpacityForEntity(edge)
  });
}

/**
 * @param {object} d3Element
 * @param {array} nodesData
 * @private
 */
function _renderNodes(d3Element, nodesData) {
  const nodes = d3Element.selectAll('.node').data(nodesData, (d) => d.id);

  // create svg element on item enter
  const nodesGroups = nodes.enter()
    .append('g')
    .classed('node', true)
    .attr('tabindex', 0)
    .each(node => InteractionManager.bindEvents(node));

  const initialNodeAttr = {
    fill: '#ebebeb',
    stroke: '#ebebeb',
    r: 5
  };

  // initial attributes are needed because of animation
  nodesGroups.append('circle').attr(initialNodeAttr);
  nodesGroups.append('text').attr('fill', '#ebebeb');

  // remove svg element on data change/remove
  nodes.exit()
    .transition()
    .duration(TRANSITION_DURATION)
    .attr(initialNodeAttr).remove();

  // update node groups
  nodes.attr({ id: node => node.id });

  nodes.select('circle')
    .attr({
      cx: node => node.x,
      cy: node => node.y
    })
    .transition()
    .duration(TRANSITION_DURATION)
    .attr({
      r: 12,
      stroke: node => node.color,
      fill: node => node.isSelected ? node.color : '#ebebeb',
      'stroke-opacity': (node) => getOpacityForEntity(node)
    });

  nodes.select('text')
    .attr({
      x: node => node.x + 20,
      y: node => node.y + 5
    })
    .transition()
    .duration(TRANSITION_DURATION)
    .text(node => node.label)
    .attr({
      fill: node => node.color,
      opacity: (node) => getOpacityForEntity(node)
    });
}

/**
 * @param {object} d3Element
 * @param {array} edgesData
 * @private
 */
function _renderEdges(d3Element, edgesData) {
  const edges = d3Element.selectAll('.edge').data(edgesData, (e) => e.id);

  const edgesGroups = edges.enter().append('g').classed('edge', true);

  const initialEdgesAttr = { stroke: '#ebebeb' };

  edgesGroups.append('path').attr(initialEdgesAttr);
  edgesGroups.append('text')
    .classed('path-text', true)
    .attr('tabindex', 0)
    .each(edge => InteractionManager.bindEvents(edge));

  edges.exit()
    .transition()
    .duration(TRANSITION_DURATION)
    .attr(initialEdgesAttr)
    .remove();

  // set edges id
  edges.attr({ id: data => data.id });

  edges.select('text').attr({
    x: edge => Edge.getEdgeMiddlePoint(edge)[0] - edge.middlePointOffset[0] + 10,
    y: edge => Edge.getEdgeMiddlePoint(edge)[1] - edge.middlePointOffset[1],
    fill: edge => DataManager.getNode(edge.startNodeID).color,
    opacity: edge => getOpacityForEntity(edge)
  }).text(e => e.label);

  // Helper function to draw paths
  const lineFunction = d3.svg.line()
    .x(d => d[0])
    .y(d => d[1])
    .interpolate('cardinal');

  edges.select('path')
    .attr({
      d: (edge) => {
        const startNode = DataManager.getNode(edge.startNodeID);
        const endNode = DataManager.getNode(edge.endNodeID);
        const midPoint = Edge.getEdgeMiddlePoint(edge);

        return lineFunction([
          [startNode.x, startNode.y],
          [midPoint[0] - edge.middlePointOffset[0], midPoint[1] - edge.middlePointOffset[1]],
          [endNode.x, endNode.y]
        ]);
      }
    })
    .transition()
    .duration(TRANSITION_DURATION)
    .attr({
      stroke: (edge) => {
        createOrUpdateArrowForEdge(edge);
        const startNode = DataManager.getNode(edge.startNodeID);
        return startNode.color;
      },
      'stroke-opacity': edge => getOpacityForEntity(edge),
      style: (edge) => `marker-end: url(#end-arrow-${edge.id})`
    });
}

/**
 * @param d3Element
 * @param options
 * @private
 */
function _setZoomAndPosition(d3Element, options) {
  d3Element.attr('transform', `translate(${options.position.left}, ${options.position.top}), scale(${options.zoom})`);
}

/** ====================================================================================================================
 * Render Manager Class
 ==================================================================================================================== */
const RenderManager = {
  init: (d3Element) => {
    RenderManager.d3Element = d3Element;

    // a wrapper for path arrows
    RenderManager.d3Element.append('defs').classed('defs');

    // a wrapper for temporal drawed paths
    RenderManager.d3Element.append('g').classed('tempPaths', true);

    // a wrapper for all paths
    RenderManager.d3GroupForEdges = RenderManager.d3Element.append('g').classed('edges', true);

    // a wrapper for all nodes
    RenderManager.d3GroupForNodes = RenderManager.d3Element.append('g').classed('nodes', true);

    // define arrow marker for leading arrow when creating new rel;
    RenderManager.d3Element.select('defs')
      .append('marker').attr({
        id: 'mark-end-arrow',
        viewBox: '0 -5 10 10',
        refX: 7,
        markerWidth: 6,
        markerHeight: 6,
        orient: 'auto'
      })
      .append('path').attr({
        d: 'M0,-5L10,0L0,5'
      });

    // drag line, add this svg to the parent svg so line can be drawen outside the global g
    RenderManager.d3Element.select('.tempPaths').append('path')
      .attr('class', 'dragLine hidden')
      .attr({
        d: 'M0,0L0,0'
      })
      .style('marker-end', 'url(#mark-end-arrow)');
  },

  /**
   *
   * @param data
   */
  prepareForRenderLine: (data) => {
    const source = data.source;

    d3.select('#mark-end-arrow').select('path').attr({
      fill: source.color
    });

    d3.select('.dragLine')
      .classed('hidden', false)
      .attr({
        stroke: source.color,
        d: ''
      });

    d3.select('body').classed('no-cursor', true);
  },

  /**
   * @param data
   */
  renderLine: (data) => {
    const start = [data.source.x, data.source.y];
    const end = data.end;

    d3.select('.dragLine')
      .attr({
        d: () => `M${start[0]},${start[1]}L${end[0]},${end[1]}`
      });
  },

  /**
   *
   */
  removeTempLine: () => {
    d3.select('.dragLine').classed('hidden', true);
    d3.select('body').classed('no-cursor', false);
  },

  /**
   * @param data
   */
  render: (data) => {
    console.log('%cRender', 'background: green; color: #fff; padding: 3px 5px; border-radius: 3px;');

    _setZoomAndPosition(RenderManager.d3Element, data.options);

    _renderEdges(RenderManager.d3GroupForEdges, data.edges);
    _renderNodes(RenderManager.d3GroupForNodes, data.nodes);
  }
};

export default RenderManager;
