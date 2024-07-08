/**
 * This file is part of the Sandy Andryanto Company Profile Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto.dev@gmail.com>
 * @copyright  2024
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

import service from './service'

class PageService {

    ping(){
        return service().get("page/ping")
    }

    home(){
        return service().get("page/home")
    }

    about(){
        return service().get("page/about")
    }

    service(){
        return service().get("page/service")
    }

    faq(){
        return service().get("page/faq")
    }

    contact(){
        return service().get("page/contact")
    }

    message(data){
        return service().post("page/message", data)
    }

    subscribe(data){
        return service().post("page/subscribe", data)
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PageService();

