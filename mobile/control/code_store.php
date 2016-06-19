<?php
/**
 * 店铺二维码及时生成  v3-b12
 *
 * 好商城v3 33hao.com
 *
 *
 ***/


defined('InShopNC') or exit('Access Invalid!');
ini_set("display_errors", "Off");
class code_storeControl {
  public function store_codeOp(){   
	if($_GET['text']){
	$text=$_GET['text'];
    $size='6';
    $level='H';
    $logo=BASE_UPLOAD_PATH.DS.ATTACH_STORE.DS.'/mb_default_store.png';
    $padding='2';
    $path=BASE_UPLOAD_PATH.DS.ATTACH_STORE.DS;
    $QR=$path.'mb_store_qrcode.png';
    require_once(BASE_RESOURCE_PATH.DS.'phpqrcode'.DS.'phpqrcode.php');
        QRcode::png($text,$QR, $level, $size,$padding);
    if($logo !== false){
        $QR = imagecreatefromstring(file_get_contents($QR));
        $logo = imagecreatefromstring(file_get_contents($logo));
        $QR_width = imagesx($QR);
        $QR_height = imagesy($QR);
        $logo_width = imagesx($logo);
        $logo_height = imagesy($logo);
        $logo_qr_width = $QR_width / 5;
        $scale = $logo_width / $logo_qr_width;
        $logo_qr_height = $logo_height / $scale;
        $from_width = ($QR_width - $logo_qr_width) / 2;
        imagecopyresampled($QR, $logo, $from_width, $from_width, 0, 0, $logo_qr_width, $logo_qr_height, $logo_width, $logo_height);
    }
    header("Content-Type:image/jpg");
    imagepng($QR);
	}else{
	output_error('参数错误00023');}
}
	}
	
?>
