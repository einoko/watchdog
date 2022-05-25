export const getVisualAlertMail = (
  jobName,
  jobUrl,
  beforeUrl,
  afterUrl,
  diffUrl
) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<title>Watchdog detected a change!</title>
	<style type="text/css">#outlook a{padding:0}body{width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin:0;padding:0}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%}#backgroundTable{margin:0;padding:0;width:100%!important;line-height:100%!important}img{outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}a img{border:none}.image_fix{display:block}p{margin:1em 0}h1,h2,h3,h4,h5,h6{color:black!important}h1 a,h2 a,h3 a,h4 a,h5 a,h6 a{color:blue!important}h1 a:active,h2 a:active,h3 a:active,h4 a:active,h5 a:active,h6 a:active{color:red!important}h1 a:visited,h2 a:visited,h3 a:visited,h4 a:visited,h5 a:visited,h6 a:visited{color:purple!important}table td{border-collapse:collapse}table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}a{color:#1D4ED8;text-decoration:underline}body{background-color:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"}.content{box-shadow:1px 1px 4px #CBD5E1;max-width:680px;background-color:#fff;border-radius:1em;padding:1em 2em;margin-top:2em}.main{width:100%;display:flex;justify-content:center}img{max-width:100%}</style>
	<!--[if IEMobile 7]>
	<style type="text/css">
		/* Targeting Windows Mobile */
	</style>
	<![endif]-->
	<!--[if gte mso 9]>
	<style>
		/* Target Outlook 2007 and 2010 */
	</style>
	<![endif]-->
</head>
<body>
	<div class="main">
		<div class="content">
			<h1>Watchdog just detected a change (${jobName})</h1>
			<p>A change was detected on <a href="${jobUrl}">${jobUrl}</a>.</p>

			<h2>Before</h2>
			<img src="data:image/png;base64,${beforeUrl}">

			<h2>Now</h2>
			<img src="data:image/png;base64,${afterUrl}">

			<h2>Overlay</h2>
			<img src="data:image/png;base64,${diffUrl}">

			<hr style="height:1px;border:none;color:black;background-color:black;" />
			<p>Watchdog will continue to monitor for any new changes on this job. If you want to stop these alerts, sign into your account, and <b>pause</b> or <b>delete</b> the job.</p>
		</div>
	</div>
</body>
</html>
  `;
};
