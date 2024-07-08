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

class PortfolioService {

    list(){
        return service().get("portfolio/list")
    }

    detail(id){
        return service().get("portfolio/detail/"+id)
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PortfolioService();