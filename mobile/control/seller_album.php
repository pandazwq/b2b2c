<?php
/**
 * 商家注销
 *
 * @好商城V4 (c) 2015-2016 33hao Inc.
 * @license    http://www.33hao.com
 * @link       交流群号：216611541
 * @since      好商城提供技术支持 授权请购买shopnc授权
 */



defined('InShopNC') or exit('Access Invalid!');

class seller_albumControl extends mobileSellerControl {

    public function __construct(){
        parent::__construct();
    }

    public function image_uploadOp() {
        $logic_goods = Logic('goods');

        $result =  $logic_goods->uploadGoodsImage(
            $_POST['name'],
            $this->seller_info['store_id'],
            $this->store_grade['sg_album_limit']
        );

        if(!$result['state']) {
            output_error($result['msg']);
        }

        output_data(array('image_name' => $result['data']['name']));
    }

}
