package data.lab.ongdb.inter;
/*
 *
 * Data Lab - graph database organization.
 *
 */

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * @author Yc-Ma
 * @PACKAGE_NAME: data.lab.ongdb.inter
 * @Description: TODO
 * @date 2021/12/14 18:06
 */
public interface OngdbInter {
    /**
     * @param
     * @return
     * @Description: TODO(从ONgDB中读取JsonFile节点 ， 获取data属性)
     */
    JSONArray getJsonFileList();

    /**
     * @param data:需要保存的JSON数据
     * @return
     * @Description: TODO(保存JsonFile节点，设置data属性)
     */
    void saveJsonFile(JSONArray data);

    /**
     * @param para label:JSON FILE文件
     * @param para id:根据ID删除JSON FILE文件
     * @description TODO(删除节点)
     */
    void deleteNodeByLabelWithFieldID(JSONObject para);
}
