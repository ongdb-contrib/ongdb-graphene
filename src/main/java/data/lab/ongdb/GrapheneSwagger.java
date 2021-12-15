package data.lab.ongdb;
/*
 *
 * Data Lab - graph database organization.
 *
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author Yc-Ma
 * @PACKAGE_NAME: data.lab.ongdb
 * @Description: TODO
 * @date 2021/12/14 17:03
 */
@Configuration
@EnableSwagger2
public class GrapheneSwagger {
    @Bean
    public Docket createSwagger() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("data.lab.ongdb"))
                .paths(PathSelectors.any())
                .build();
    }

    /**
     *
     * @Description: TODO
     */
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                /*页面标题*/
                .title("ONgDB Graphene API")
                /*创建人*/
                .contact(new Contact("Graph Developer", "https://yc-ma.blog.csdn.net/", "yanchaoma@foxmail.com"))

//                .extensions()
                .license("Apache 2.0")
                .licenseUrl("http://www.apache.org/licenses/LICENSE-2.0.html")
                .termsOfServiceUrl("")

                /*页面标题*/
                .description(new StringBuilder()
                        /**********************基础描述**********************/
                        .append("DataLab - graph database organization.")
                        .append("\n")
//                        .append(someDescription())
//                        .append(apiDescription())
                        .toString())
                /*版本号*/
                .version("1.0.0")
                .build();
    }
}

