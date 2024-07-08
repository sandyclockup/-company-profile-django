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

import axios from "axios"

export default function service(upload, auth) {

    let baseURL = process.env.REACT_APP_BACKEND_URL
    let headers = {}

    if(upload){
        headers = {
            'Content-Type': 'multipart/form-data'
        }
    }else{
        headers = {
            'Content-Type': 'application/json; charset=UTF-8;'
        }
    }


    if (auth) {
        headers.Authorization = 'Token ' + localStorage.getItem('token')
    }

    return axios.create({baseURL: baseURL, headers: headers });
}