<?php defined('InShopNC') or exit('Access Invalid!');?>

<div class="page">
  <div class="fixed-bar">
    <div class="item-title">
      <h3><?php echo '物流跟踪';?></h3>
	<?php echo $output['top_link'];?>
    </div>
  </div>
  <div class="fixed-empty"></div>
  <form method="post" name="settingForm">
    <input type="hidden" name="form_submit" value="ok" />
    <table class="table tb-type2">
      <tbody>
        <tr class="noborder">
          <td colspan="2" class="required"><label><?php echo '是否启用物流跟踪功能';?>:</label></td>
        </tr>
        <tr class="noborder">
          <td class="vatop rowform onoff"><label for="kd100_isuse_1" class="cb-enable <?php if($output['list_setting']['kd100_isuse'] == '1'){ ?>selected<?php } ?>" title="<?php echo $lang['qq_isuse_open'];?>"><span><?php echo $lang['qq_isuse_open'];?></span></label>
            <label for="kd100_isuse_0" class="cb-disable <?php if($output['list_setting']['kd100_isuse'] == '0'){ ?>selected<?php } ?>" title="<?php echo $lang['qq_isuse_close'];?>"><span><?php echo $lang['qq_isuse_close'];?></span></label>
            <input type="radio" id="kd100_isuse_1" name="kd100_isuse" value="1" <?php echo $output['list_setting']['kd100_isuse']==1?'checked=checked':''; ?>>
            <input type="radio" id="kd100_isuse_0" name="kd100_isuse" value="0" <?php echo $output['list_setting']['kd100_isuse']==0?'checked=checked':''; ?>></td>
          <td class="vatop tips"><?php echo '开启后，可通过快递100实现物流跟踪查询';?></td>
        </tr>
        <tr>
          <td colspan="2" class="required"><label class="validation" for="qq_appid"><?php echo '物流跟踪密钥';?>:</label></td>
        </tr>
        <tr class="noborder">
          <td class="vatop rowform"><input id="kd100_appid" name="kd100_appid" value="<?php echo $output['list_setting']['kd100_appid'];?>" class="txt" type="text">
            </td>
          <td class="vatop tips"><a style="color:#ffffff; font-weight:bold;" target="_blank" href="http://www.kuaidi100.com/openapi/applyapi.shtml?33hao"><?php echo '快递100物流查询密钥申请'; ?></a></td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="tfoot">
          <td colspan="2" ><a href="JavaScript:void(0);" class="btn" onclick="document.settingForm.submit()"><span><?php echo $lang['nc_submit'];?></span></a></td>
        </tr>
      </tfoot>
    </table>
  </form>
</div>
