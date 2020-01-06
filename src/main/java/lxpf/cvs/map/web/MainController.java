package lxpf.cvs.map.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * MainController
 * @author      정호경
 * @since       2019.11.28
 * @version     1.0
 * @see
 **/

@Controller
public class MainController {

    @Value("${server.map.host}")
    String serverMapHost;

    @Value("${server.mapcmm.host}")
    String serverMapCmmHost;

    @Value("${server.file.host}")
    String serverFileHost;

    @RequestMapping(value="/")
    public String root() {
        return "main";         // 실제 호출될 /WEB-INF/jsp/main.jsp
    }

    @RequestMapping(value="/maplist/")
    public String maplist(Map<String, Object> model)  {
        model.put("serverMapHost", serverMapHost);
        model.put("serverMapCmmHost", serverMapCmmHost);
        model.put("serverFileHost", serverFileHost);
        return "view/maplist";         // 실제 호출될 /WEB-INF/jsp/main.jsp
    }

    @RequestMapping(value="/map/")
    public String map(Map<String, Object> model)  {
        model.put("serverMapHost", serverMapHost);
        model.put("serverMapCmmHost", serverMapCmmHost);
        model.put("serverFileHost", serverFileHost);
        return "view/map";         // 실제 호출될 /WEB-INF/jsp/main.jsp
    }

    @RequestMapping(value="/data/")
    public String data(Map<String, Object> model) {
        model.put("serverMapHost", serverMapHost);
        model.put("serverMapCmmHost", serverMapCmmHost);
        model.put("serverFileHost", serverFileHost);
        return "view/data";         // 실제 호출될 /WEB-INF/jsp/data.jsp
    }
}
