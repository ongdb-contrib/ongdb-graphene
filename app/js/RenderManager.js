'use strict';

import DataManager from './DataManager';
import InteractionManager from './InteractionManager';

/**
 * Private variables/consts
 */
const TRANSITION_DURATION = 100;
let instance = null;


function getOpacityForEntity(entity) {
  if (entity.isNode && entity.isSelected) {
    return 1;
  }

  if (!entity.isNode && DataManager.getNode(entity.startNodeID).isSelected) {
    return 1;
  }

  if (!DataManager.isNodeSelected() && !DataManager.isEdgeSelected()) {
    return 1;
  }

  return 0.2;
}

// each edge need to have it's own arrow for pointing,
// so you can set different colors and opacity when selecting nodes and the edge itself
function createOrUpdateArrowForEdge(edge) {
  const edgeColor = DataManager.getNode(edge.startNodeID).color;
  const arrowId = `end-arrow-${edge.id}`;

  // create an arrow
  if (document.querySelector(`#${arrowId}`) === null) {
    d3.select('defs')
      .append('marker').attr({
        id: arrowId
      })
      .append('svg:path').attr({
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
    opacity: getOpacityForEntity(DataManager.getNode(edge.startNodeID))
  });
}

/**
 *
 * @param {object} d3Element
 * @param {array} nodesData
 * @private
 */
function _renderNodes(d3Element, nodesData) {
  const nodes = d3Element.selectAll('.node').data(nodesData, (d) => d.id);

  // create svg element on item enter
  const nodesGroups = nodes.enter()
    .append('g').classed('node', true)
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
  nodes.attr({id: node => node.id});

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
 *
 * @param {object} d3Element
 * @param {array} edgesData
 * @private
 */
function _renderEdges(d3Element, edgesData) {
  const edges = d3Element.selectAll('.edge').data(edgesData, (e) => e.id);

  const edgesGroups = edges.enter().append('g').classed('edge', true);

  const initialEdgesAttr = { stroke: '#ebebeb' };

  edgesGroups.append('path').attr(initialEdgesAttr);
  edgesGroups.append('text').each(edge => InteractionManager.bindEvents(edge));

  edges.exit()
    .transition()
    .duration(TRANSITION_DURATION)
    .attr(initialEdgesAttr)
    .remove();

  // set edges id
  edges.attr({ id: data => data.id });

  edges.select('text').attr({
    x: edge => {
      return (DataManager.getNode(edge.startNodeID).x + DataManager.getNode(edge.endNodeID).x) / 2;
    },
    y: edge => {
      return (DataManager.getNode(edge.startNodeID).y + DataManager.getNode(edge.endNodeID).y) / 2;
    },
    fill: edge => DataManager.getNode(edge.startNodeID).color,
    opacity: edge => getOpacityForEntity(edge)
  })
    .text(e => e.label);

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
        return lineFunction([[startNode.x, startNode.y], [100, 100], [endNode.x, endNode.y]]);
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
      'stroke-opacity': edge => getOpacityForEntity(DataManager.getNode(edge.startNodeID)),
      style: (edge) => `marker-end: url(#end-arrow-${edge.id})`
    });
}

function _setZoomAndPosition(d3Element, options) {
  d3Element.attr('transform', `translate(${options.position.left}, ${options.position.top}), scale(${options.zoom})`);
}

/**
 * Render Manager Class
 */
class RenderManager {
  constructor(d3Element) {
    if (!instance) {
      instance = this;
    }

    this.d3Element = d3Element;

    // a wrapper for path arrows
    this.d3Element.append('defs').classed('defs');

    // a wrapper for temporal drawed paths
    this.d3Element.append('g').classed('tempPaths', true);

    // a wrapper for all paths
    this.d3GroupForEdges = this.d3Element.append('g').classed('edges', true);

    // a wrapper for all nodes
    this.d3GroupForNodes = this.d3Element.append('g').classed('nodes', true);


    // define arrow marker for leading arrow when creating new rel;
    this.d3Element.select('defs')
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
    this.d3Element.select('.tempPaths').append('path')
      .attr('class', 'dragLine hidden')
      .attr({
        d: 'M0,0L0,0'
      })
      .style('marker-end', 'url(#mark-end-arrow)');
  }

  static renderLine(data) {
    const start = data.start;
    const end = data.end;

    d3.select('.dragLine')
      .classed('hidden', false)
      .attr({
        d: () => `M${start[0]},${start[1]}L${end[0]},${end[1]}`
      });
  }

  static removeTempLine() {
    d3.select('.dragLine').classed('hidden', true);
  }

  render(data) {
    console.log('%cRender', 'background: green; color: #fff; padding: 3px 5px; border-radius: 3px;');

    _setZoomAndPosition(this.d3Element, data.options);

    _renderEdges(this.d3GroupForEdges, data.edges);
    _renderNodes(this.d3GroupForNodes, data.nodes);
  }
}

export default RenderManager;
