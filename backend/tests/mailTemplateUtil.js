export const getVisualAlertMail = (
  jobName,
  jobUrl,
  beforeBase64,
  afterBase64,
  diffBase64,
  beforeFullLink,
  afterFullLink,
  diffFullLink,
  cancelJobLink
) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Watchdog detected a change!</title><style type="text/css">#outlook a{padding:0}body{width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin:0;padding:0}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%}#backgroundTable{margin:0;padding:0;width:100%!important;line-height:100%!important}img{outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}a img{border:none}.image_fix{display:block}p{margin:1em 0}h1,h2,h3,h4,h5,h6{color:black!important}h1 a,h2 a,h3 a,h4 a,h5 a,h6 a{color:blue!important}h1 a:active,h2 a:active,h3 a:active,h4 a:active,h5 a:active,h6 a:active{color:red!important}h1 a:visited,h2 a:visited,h3 a:visited,h4 a:visited,h5 a:visited,h6 a:visited{color:purple!important}table td{border-collapse:collapse}table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}a{color:#1D4ED8;text-decoration:underline}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"}.content{max-width:680px;background-color:#fff;border-radius:1em;padding:1em 2em;}.main{width:100%;display:flex;justify-content:center}img{max-width:100%}</style><!--[if IEMobile 7]><style type="text/css">/* Targeting Windows Mobile */</style><![endif]--><!--[if gte mso 9]><style>/* Target Outlook 2007 and 2010 */</style><![endif]--></head>
  <body>
    <div class="main">
      <div class="content">
      <h1>Watchdog just detected a change (${jobName})</h1>
      <p>A change was detected on <a href="${jobUrl}">${jobUrl}</a>.</p>
        <div style="margin-top:2em;margin-bottom: 2em;">
          <h2>Before</h2>
          <img src="data:image/png;base64,${beforeBase64}">
          <a href="${beforeFullLink}">View full image</a>

          <h2>Now</h2>
          <img src="data:image/png;base64,${afterBase64}">
          <a href="${afterFullLink}">View full image</a>

          <h2>Overlay</h2>
          <img src="data:image/png;base64,${diffBase64}">
          <a href="${diffFullLink}">View full image</a>
        </div>
        <hr style="height:1px;border:none;color:black;background-color:black;margin-top:1em;" />

        <p>Watchdog will continue to monitor for any new changes on this job. If you want to cancel this job, please click the link below.</p>

        <a href="${cancelJobLink}">Cancel this job</a>

        <hr style="height:1px;border:none;color:black;background-color:black;margin-top:1em;" />
        <p style="font-size:0.7em">Watchdog – Self-hosted website monitoring</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const getTextAlertMail = (jobName, jobUrl, cancelJobLink) => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Watchdog detected a change!</title><style type="text/css">#outlook a{padding:0}body{width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin:0;padding:0}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%}#backgroundTable{margin:0;padding:0;width:100%!important;line-height:100%!important}img{outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}a img{border:none}.image_fix{display:block}p{margin:1em 0}h1,h2,h3,h4,h5,h6{color:black!important}h1 a,h2 a,h3 a,h4 a,h5 a,h6 a{color:blue!important}h1 a:active,h2 a:active,h3 a:active,h4 a:active,h5 a:active,h6 a:active{color:red!important}h1 a:visited,h2 a:visited,h3 a:visited,h4 a:visited,h5 a:visited,h6 a:visited{color:purple!important}table td{border-collapse:collapse}table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}a{color:#1D4ED8;text-decoration:underline}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"}.content{max-width:680px;background-color:#fff;border-radius:1em;padding:1em 2em;}.main{width:100%;display:flex;justify-content:center}img{max-width:100%}</style><!--[if IEMobile 7]><style type="text/css">/* Targeting Windows Mobile */</style><![endif]--><!--[if gte mso 9]><style>/* Target Outlook 2007 and 2010 */</style><![endif]--></head>
<body>
	<div class="main">
		<div class="content">
      <h1>Watchdog just detected a change (${jobName})</h1>
      <p>A change was detected on <a href="${jobUrl}">${jobUrl}</a>.</p>
			<div style="margin-top:2em;margin-bottom: 2em;">

        <p style="text-align:center;">Keyword <b style="text-decoration:underline;">sold out</b> was not found.</p>

        <p style="text-align:center;">Keyword <b style="text-decoration:underline;">back in stock</b> was found.</p>

      </div>
      <hr style="height:1px;border:none;color:black;background-color:black;margin-top:1em;" />

      <p>Watchdog will continue to monitor for any new changes on this job. If you want to cancel this job, please click the link below.</p>

      <a href="${cancelJobLink}">Cancel this job</a>

      <hr style="height:1px;border:none;color:black;background-color:black;margin-top:1em;" />
      <p style="font-size:0.7em">Watchdog – Self-hosted website monitoring</p>
		</div>
	</div>
</body>
</html>
`;
};

export const getPasswordResetMail = (resetLink) => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Watchdog detected a change!</title><style type="text/css">#outlook a{padding:0}body{width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin:0;padding:0}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%}#backgroundTable{margin:0;padding:0;width:100%!important;line-height:100%!important}img{outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}a img{border:none}.image_fix{display:block}p{margin:1em 0}h1,h2,h3,h4,h5,h6{color:black!important}h1 a,h2 a,h3 a,h4 a,h5 a,h6 a{color:blue!important}h1 a:active,h2 a:active,h3 a:active,h4 a:active,h5 a:active,h6 a:active{color:red!important}h1 a:visited,h2 a:visited,h3 a:visited,h4 a:visited,h5 a:visited,h6 a:visited{color:purple!important}table td{border-collapse:collapse}table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}a{color:#1D4ED8;text-decoration:underline}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"}.content{max-width:680px;background-color:#fff;border-radius:1em;padding:1em 2em;}.main{width:100%;display:flex;justify-content:center}img{max-width:100%}</style><!--[if IEMobile 7]><style type="text/css">/* Targeting Windows Mobile */</style><![endif]--><!--[if gte mso 9]><style>/* Target Outlook 2007 and 2010 */</style><![endif]--></head>
<body>
	<div class="main">
		<div class="content">
			<h1>Watchdog Password Reset</h1>
			<p>You have received this message because a password reset for your Watchdog account has been requested. If you wish to change your Watchdog password, click the link below.</p>

      <p style="margin-top:2em;margin-bottom:2em;text-align:center;"><a href="${resetLink}">Change your Watchdog password</a></p>

      <p>If you did not initiate the password reset, please disregard this message.</p>

      <hr style="height:1px;border:none;color:black;background-color:black;margin-top:1em;" />
      <p style="font-size:0.7em">Watchdog – Self-hosted website monitoring</p>
		</div>
	</div>
</body>
</html>
  `;
};
