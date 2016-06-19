<?php
/**
 * 评价订单
 *
 * @好商城V4 (c) 2015-2016 33hao Inc.
 * @license    http://www.33hao.com
 * @link       交流群号：216611541
 * @since      好商城提供技术支持 授权请购买shopnc授权
 */




defined('InShopNC') or exit('Access Invalid!');

class member_evaluateControl extends mobileMemberControl {

    public function __construct() {
        parent::__construct();
    }

    /**
     * 评价
     */
    public function indexOp() {
		$order_id = $_GET['order_id'];
        if($order_id<=0){
			output_error('参数错误');	
		}
		$model_order = Model('order');
		$model_store = Model('store');
		

		$order_info = $model_order->getOrderInfo(array('order_id' => $order_id));
		//查询店铺信息
        $store_info = $model_store->getStoreInfoByID($order_info['store_id']);
        if(empty($store_info)){
            output_error('订单不存在');
        }

		//获取订单商品
        $order_goods = $model_order->getOrderGoodsList(array('order_id'=>$order_id));
        if(empty($order_goods)){
            output_error('订单不存在');
        }

		for ($i = 0, $j = count($order_goods); $i < $j; $i++) {
			$order_goods[$i]['goods_image_url'] = cthumb($order_goods[$i]['goods_image'], 240, $store_info['store_id']);
		}
		$data=array();
		$data['order_goods'] = $order_goods;
		$data['store_info'] = $store_info;
		output_data($data);
    }

	/**
     * 评价提交
     */
    public function saveOp() {
		$order_id = $_POST['order_id'];
        if($order_id<=0){
			output_error('参数错误');	
		}
		//获取订单商品
		$model_order = Model('order');
		$model_evaluate_goods = Model('evaluate_goods');
        $model_evaluate_store = Model('evaluate_store');
        $order_goods = $model_order->getOrderGoodsList(array('order_id'=>$order_id));
        if(empty($order_goods)){
            output_error('订单错误');
        }
		$model_store = Model('store');
		
		$order_info = $model_order->getOrderInfo(array('order_id' => $order_id));
		//查询店铺信息
        $store_info = $model_store->getStoreInfoByID($order_info['store_id']);
		
		$evaluate_goods_array = array();
		$goodsid_array = array();
		foreach ($order_goods as $value){
			//如果未评分，默认为5分
			$evaluate_score = intval($_POST['goods'][$value['rec_id']]['score']);
			if($evaluate_score <= 0 || $evaluate_score > 5) {
				$evaluate_score = 5;
			}
			//默认评语
			$evaluate_comment = $_POST['goods'][$value['rec_id']]['comment'];
			if(empty($evaluate_comment)) {
				$evaluate_comment = '不错哦';
			}
			
			$geval_image = '';
			if (isset($_POST['goods'][$value['rec_id']]['evaluate_image']) && is_array($_POST['goods'][$value['rec_id']]['evaluate_image'])) {
				foreach ($_POST['goods'][$value['rec_id']]['evaluate_image'] as $val) {
					if(!empty($val)) {
						$geval_image .= $val . ',';
					}
				}
			}
			$geval_image = rtrim($geval_image, ',');
			
			$evaluate_goods_info = array();
			$evaluate_goods_info['geval_orderid'] = $order_id;
			$evaluate_goods_info['geval_orderno'] = $order_info['order_sn'];
			$evaluate_goods_info['geval_ordergoodsid'] = $value['rec_id'];
			$evaluate_goods_info['geval_goodsid'] = $value['goods_id'];
			$evaluate_goods_info['geval_goodsname'] = $value['goods_name'];
			$evaluate_goods_info['geval_goodsprice'] = $value['goods_price'];
			$evaluate_goods_info['geval_goodsimage'] = $value['goods_image'];
			$evaluate_goods_info['geval_scores'] = $evaluate_score;
			$evaluate_goods_info['geval_content'] = $evaluate_comment;
			$evaluate_goods_info['geval_isanonymous'] = $_POST['goods'][$value['rec_id']]['anony']?1:0;
			$evaluate_goods_info['geval_addtime'] = TIMESTAMP;
			$evaluate_goods_info['geval_storeid'] = $store_info['store_id'];
			$evaluate_goods_info['geval_storename'] = $store_info['store_name'];
			$evaluate_goods_info['geval_frommemberid'] = $this->member_info['member_id'];
			$evaluate_goods_info['geval_frommembername'] = $this->member_info['member_name'];
			$evaluate_goods_info['geval_image'] = $geval_image;
			$evaluate_goods_info['geval_content_again'] = '';
			$evaluate_goods_info['geval_image_again'] = '';
			$evaluate_goods_info['geval_explain_again'] = '';

			$evaluate_goods_array[] = $evaluate_goods_info;

			$goodsid_array[] = $value['goods_id'];
		}
		
		$model_evaluate_goods->addEvaluateGoodsArray($evaluate_goods_array, $goodsid_array);

		$store_desccredit = intval($_POST['store_desccredit']);
		if($store_desccredit <= 0 || $store_desccredit > 5) {
			$store_desccredit= 5;
		}
		$store_servicecredit = intval($_POST['store_servicecredit']);
		if($store_servicecredit <= 0 || $store_servicecredit > 5) {
			$store_servicecredit = 5;
		}
		$store_deliverycredit = intval($_POST['store_deliverycredit']);
		if($store_deliverycredit <= 0 || $store_deliverycredit > 5) {
			$store_deliverycredit = 5;
		}
		//添加店铺评价
		if (!$store_info['is_own_shop']) {
			$evaluate_store_info = array();
			$evaluate_store_info['seval_orderid'] = $order_id;
			$evaluate_store_info['seval_orderno'] = $order_info['order_sn'];
			$evaluate_store_info['seval_addtime'] = time();
			$evaluate_store_info['seval_storeid'] = $store_info['store_id'];
			$evaluate_store_info['seval_storename'] = $store_info['store_name'];
			$evaluate_store_info['seval_memberid'] = $this->member_info['member_id'];
			$evaluate_store_info['seval_membername'] = $this->member_info['member_name'];
			$evaluate_store_info['seval_desccredit'] = $store_desccredit;
			$evaluate_store_info['seval_servicecredit'] = $store_servicecredit;
			$evaluate_store_info['seval_deliverycredit'] = $store_deliverycredit;
		}
		$model_evaluate_store->addEvaluateStore($evaluate_store_info);

		//更新订单信息并记录订单日志
		
		$state = $model_order->editOrder(array('evaluation_state'=>1), array('order_id' => $order_id));
		$model_order->editOrderCommon(array('evaluation_time'=>TIMESTAMP), array('order_id' => $order_id));
		if ($state){
			
			$data = array();
			$data['order_id'] = $order_id;
			$data['log_role'] = 'buyer';
			$data['log_msg'] = L('order_log_eval');
			$model_order->addOrderLog($data);
			
		}

		//添加会员积分
		if (C('points_isuse') == 1){
			
			$points_model = Model('points');
			$points_model->savePointsLog('comments',array('pl_memberid'=>$this->member_info['member_id'],'pl_membername'=>$this->member_info['member_name']));
		}
		//添加会员经验值
		Model('exppoints')->saveExppointsLog('comments',array('exp_memberid'=>$this->member_info['member_id'],'exp_membername'=>$this->member_info['member_name']));;

		output_data('评价成功');
	
	}

}
