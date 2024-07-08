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

class AuthService {

    login(data){
        return service().post("auth/login", data)
    }

    register(data){
        return service().post("auth/register", data)
    }

    confirm(token){
        return service().get("auth/confirm/"+token)
    }

    emailForgot(data){
        return service().post("auth/email/forgot", data)
    }

    resetPassword(token, data){
        return service().post("auth/email/reset/"+token, data)
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();