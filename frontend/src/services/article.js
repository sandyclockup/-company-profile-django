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

class ArticleService {

    list(data){
        return service().get("article/list", { params : data })
    }

    detail(slug){
        return service().get("article/detail/"+slug)
    }

    commentList(id){
        return service().get("article/comment/list/"+id)
    }

    commentCreate(id, data){
        return service(false, true).post("article/comment/create/"+id, data)
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ArticleService();