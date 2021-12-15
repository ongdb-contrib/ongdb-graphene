package data.lab.ongdb.controller;
/*
 *
 * Data Lab - graph database organization.
 *
 */

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import data.lab.ongdb.services.OngdbServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * @author Yc-Ma
 * @PACKAGE_NAME: data.lab.ongdb.controller
 * @Description: TODO
 * @date 2021/11/30 9:58
 */
@Controller
@RequestMapping("/main")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MainController {

    @Autowired
    private OngdbServices ongdbServices;

    /**
     * @return Hello World
     * @Description: TODO
     */
    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    @ResponseBody
    public String index() {
        return "Hello World!";
    }

    /**
     * @return JSON FILE LIST
     * @Description: TODO(从ONgDB中读取JsonFile节点 ， 获取data属性)
     */
    @RequestMapping(value = "/getJsonFileList", method = RequestMethod.GET)
    @ResponseBody
    public JSONArray getJsonFileList() {
        return ongdbServices.getJsonFileList();
    }

    /**
     * @return SAVE FILE LIST
     * @Description: TODO(保存JsonFile节点 ， 设置data属性)
     */
    @RequestMapping(value = "/saveJsonFile", method = RequestMethod.POST)
    @ResponseBody
    public void saveJsonFile(@RequestBody JSONArray data) {
        ongdbServices.saveJsonFile(data);
    }

    /**
     * @param para label:JSON FILE文件
     * @param para id:根据ID删除JSON FILE文件
     * @description TODO(删除节点)
     */
    @RequestMapping(value = "/deleteNodeByLabelWithFieldID", method = RequestMethod.POST)
    @ResponseBody
    public void deleteNodeByLabelWithFieldID(@RequestBody JSONObject para) {
        ongdbServices.deleteNodeByLabelWithFieldID(para);
    }
}






