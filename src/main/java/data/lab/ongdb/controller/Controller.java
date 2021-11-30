package data.lab.ongdb.controller;
/*
 *
 * Data Lab - graph database organization.
 *
 */

import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Yc-Ma
 * @PACKAGE_NAME: data.lab.ongdb.controller
 * @Description: TODO
 * @date 2021/11/30 9:58
 */
@RequestMapping("/")
@CrossOrigin(origins = "*", maxAge = 3600)
public class Controller {

    /**
     * @param
     * @return  http://localhost:8081/ongdb-graphene
     *          https://localhost:8082/ongdb-graphene
     * @Description: TODO(页面访问Index入口)
     */
    @RequestMapping(value="/",method = RequestMethod.GET)
    public String index(ModelMap modelMap) {
        modelMap.put("msg", "SpringBoot Ajax");
        return "index";
    }
}






