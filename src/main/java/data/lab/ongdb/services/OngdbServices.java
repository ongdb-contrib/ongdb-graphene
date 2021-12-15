package data.lab.ongdb.services;
/*
 *
 * Data Lab - graph database organization.
 *
 */

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import data.lab.ongdb.inter.OngdbInter;
import org.neo4j.graphdb.*;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.io.fs.FileUtils;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Yc-Ma
 * @PACKAGE_NAME: data.lab.ongdb.services
 * @Description: TODO
 * @date 2021/12/14 18:30
 */
@Service
public class OngdbServices implements OngdbInter {

    private static final File DATABASE_DIRECTORY = new File("database" + File.separator + "graph.db");

    private static GraphDatabaseService graphDb;

    public OngdbServices() throws IOException {
        if (!DATABASE_DIRECTORY.exists()) {
            FileUtils.deleteRecursively(DATABASE_DIRECTORY);
        }
        graphDb = new GraphDatabaseFactory().newEmbeddedDatabase(DATABASE_DIRECTORY);
        registerShutdownHook(graphDb);
        createConstraintsAndIndexes();
    }

    private static void registerShutdownHook(final GraphDatabaseService graphDb) {
        Runtime.getRuntime().addShutdownHook(new Thread(graphDb::shutdown));
    }

    private static void createConstraintsAndIndexes() {
        try (Transaction tx = graphDb.beginTx()) {
            graphDb.execute("CREATE CONSTRAINT ON (n:JsonFile) ASSERT n.id IS UNIQUE;");
            tx.success();
        }
    }

    /**
     * @return
     * @Description: TODO(从ONgDB中读取JsonFile节点 ， 获取data属性)
     */
    @Override
    public JSONArray getJsonFileList() {
        JSONArray array = new JSONArray();
        try (Transaction tx = graphDb.beginTx()) {
            Result result = graphDb.execute("MATCH (n:JsonFile) RETURN n.data AS data");
            while (result.hasNext()) {
                Map<String, Object> re = result.next();
                Object data = re.get("data");
                array.add(JSONObject.parse(String.valueOf(data)));
            }
            tx.success();
        }
        return array;
    }

    /**
     * @return
     * @Description: TODO(保存JsonFile节点 ， 设置data属性)
     */
    @Override
    public void saveJsonFile(JSONArray data) {
        try (Transaction tx = graphDb.beginTx()) {
            data.forEach(v -> {
                Map<String, Object> para = new HashMap<>();
                JSONObject object = JSONObject.parseObject(JSON.toJSONString(v));
                para.put("id", object.getString("id"));
                para.put("data", object.toJSONString());
                graphDb.execute("MERGE (n:JsonFile {id:$id}) SET n.data=$data", para);
            });
            tx.success();
        }
    }

    /**
     * @param para label:JSON FILE文件
     * @param para id:根据ID删除JSON FILE文件
     * @description TODO(删除节点)
     */
    @Override
    public void deleteNodeByLabelWithFieldID(JSONObject para) {
        String label = para.getString("label");
        try (Transaction tx = graphDb.beginTx()) {
            graphDb.execute("MATCH (n:"+label+" {id:$id}) DELETE n", para);
            tx.success();
        }
    }
}

