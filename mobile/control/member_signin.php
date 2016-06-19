<?php
/**
 * 签到
 *
 * @好商城V4 (c) 2005-2016 33hao Inc.
 * @license    http://www.33hao.com
 * @link       交流群号：216611541
 * @since      好商城提供技术支持 授权请购买shopnc授权
 */

defined('InShopNC') or exit('Access Invalid!');

class member_signinControl extends mobileMemberControl {

    public function __construct() {
        parent::__construct();
    }

    /**
     * 签到列表
     */
    public function signin_listOp() {
		$condition_arr = $list_log = array();
        $condition_arr['pl_memberid'] = $this->member_info['member_id'];
  
        //分页
        $page   = new Page();
        $points_model = Model('points');
        $list = $points_model->getPointsLogList($condition_arr,$page,'*','');


		foreach($list as $key=>$value){
			$list_log[$key]['sl_id'] = $value['pl_id'];
			$list_log[$key]['sl_memberid'] = $value['pl_memberid'];
			$list_log[$key]['sl_membername'] = $value['pl_membername'];
			$list_log[$key]['sl_addtime'] = $value['pl_addtime'];
			$list_log[$key]['sl_points'] = $value['pl_points'];
			$list_log[$key]['sl_desc'] = $value['pl_desc'];			
			$list_log[$key]['sl_addtime_text'] = date('Y-m-d H:i:s',$value['pl_addtime']);
		}			
        
		$page_count = $points_model->gettotalpage();		
		output_data(array('signin_list' => $list_log),mobile_page($page_count));       
    }
	

	/**
     * 检验是否能签到
     */
    public function checksigninOp() {   
		$condition =array();
		$condition['pl_memberid'] = $this->member_info['member_id'];
		$condition['pl_stage'] = 'signin';
		$totime = strtotime(date('Ymd000000'));
		$condition['saddtime'] = $totime;
		//$condition['eaddtime'] = $totime+86400;
		$points_model = Model('points');
		$log_array = $points_model->getPointsInfo($condition);
		if (!empty($log_array)){
			output_error('已签到');
		}else{	
			$points_signin = intval(C('points_signin'));
			output_data(array('points_signin'=>$points_signin));  
		}
    }
	
	/**
     * 签到 array('pl_memberid'=>'会员编号','pl_membername'=>'会员名称','pl_adminid'=>'管理员编号','pl_adminname'=>'管理员名称','pl_points'=>'积分','pl_desc'=>'描述','orderprice'=>'订单金额','order_sn'=>'订单编号','order_id'=>'订单序号','point_ordersn'=>'积分兑换订单编号');
     */
    public function signin_addOp() {
		$points_signin = intval(C('points_signin'));//签到对得积分数
		$points_model = Model('points');
		$insertarr['pl_memberid'] = $this->member_info['member_id'];
		$insertarr['pl_membername'] = $this->member_info['member_name'];
		$insertarr['pl_points'] = $points_signin;
		$insertarr['pl_addtime'] = time();
		$return = $points_model->savePointsLog('signin',$insertarr,false);
        if($return){
			$points_signin = $points_signin+$this->member_info['member_points'];
			output_data(array('point'=>$points_signin));   
		}
    }
		

}
