interface LayoutParams {
  content?: string
  greetingName?: string
  showHeader?: boolean
  showSupport?: boolean
  showSubscribe?: boolean
  withAccept?: boolean
  supportContent?: string
}

export const content = ({
  content,
  greetingName,
  withAccept = false,
  showHeader = false,
  showSupport = true,
  showSubscribe = true,
  supportContent
}: LayoutParams): string => {
  const assetsPath = `${process.env['APP_ORIGIN']}/mail`
  const header = `
  <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
    <tr>
      <td style="padding: 6%;">
        <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
          <tr>
            <td style="text-align: left" valign="middle">
            <a href="${process.env['APP_ORIGIN']}"><img src="${assetsPath}/logo.png" style="width: 200px;max-width: 100%;" /></a>
            </td>
            <td style="width: 6%"></td>
            <td style="text-align: right" valign="middle">
              <a href="${process.env['APP_ORIGIN']}"><img src="${assetsPath}/button.png" style="width: 158px;max-width: 100%;" /></a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `
  const hr = `
  <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
    <tr>
      <td style="background: #f1f1f3; height: 1px;"></td>
    </tr>
  </table>
  `
  const support = `
    <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
      <tr>
        <td style="padding: 4% 6% 8%;">
          <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
            <tr>
              <td style="color: #333333; text-align: center; font-size: 16px; font-family: sans-serif; line-height: 20px">
                ${supportContent || `Пожелания и вопросы по работе сервиса направляйте на <a style="color: #001eff" href="mailto:"></a> Телефон службы технической поддержки `}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `
  const accept = `
    <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
      <tr>
        <td style="padding: 4% 6% 8%;text-align: center">
          <a href="https://notariats.ru/mail/accept/{letterId}" style="
            display: inline-block;
            border-radius: 8px;
            font-size: 14px;
            line-heught: 1;
            padding: 12px 24px;
            color: #fff;
            background: #b91c1c;
            text-decoration: none;
          ">Подтвердить получение</a>
          <img width="1" height="1" src="https://notariats.ru/mail/pixel/{letterId}" alt="Подтвердить получение" />
        </td>
      </tr>
    </table>
  `
  const subscribe = `
    <br />
    <br />
    <br />
    С уважением, <br />
    команда разработчиков сервиса <br />
    <a href="${process.env['APP_ORIGIN']}">${process.env['APP_ORIGIN']}</a>
  `
  const greeting = `
    Уважаемый(ая) <strong>${greetingName}</strong>.<br />
    <br />
    <br />
  `
  return `<table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
  <tr>
    <td align="center">
      <center style="max-width: 640px; width: 100%">
        <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
          <tr>
            <td style="background:url(${assetsPath}/mail-pattern-top.png) repeat-x -4px 4px; background-size: auto 13px;">
              <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
                <tr>
                  <td style="width:18px;height:18px;background:url(${assetsPath}/mail-left-top.png) no-repeat 0 0;background-size: 18px 18px;"></td>
                  <td style="height:18px;background:url(${assetsPath}/mail-center-top.png) repeat-X 0 0;background-size: auto 18px;"></td>
                  <td style="width:18px;height:18px;background:url(${assetsPath}/mail-right-top.png) no-repeat 0 0;background-size: 18px 18px;"></td>
                </tr>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
                <tr>
                  <td style="width:8px;background:url(${assetsPath}/mail-left-center.png) repeat-y 0 0;background-size: 8px auto;"></td>
                  <td style="background:#fff">
                    ${showHeader ? header : ``}

                    <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
                      <tr>
                        <td style="padding: 0 6%; background: url('${assetsPath}/cars.png') no-repeat 95% 95%;">
                          ${showHeader ? hr : ``}
      
                          <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
                            <tr>
                              <td style="color: #333333; font-size: 16px; font-family: sans-serif; line-height: 20px; padding: 6% 0;">
                                ${greetingName ? greeting : ``}

                                ${content}

                                ${showSubscribe ? subscribe : ``}
                              </td>
                            </tr>
                          </table>
      
                          ${showSupport ? hr : ``}
                        </td>
                      </tr>
                    </table>

                    ${showSupport ? support : ``}

                    ${withAccept ? accept : ``}
                  </td>
                  <td style="width:8px;background:url(${assetsPath}/mail-right-center.png) repeat-y 0 0;background-size: 8px auto;"></td>
                </tr>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" style="margin:0;padding:0" width="100%">
                <tr>
                  <td style="width:8px;height:8px;background:url(${assetsPath}/mail-left-bottom.png) no-repeat 0 0;background-size: 8px 8px;"></td>
                  <td style="height:8px;background:url(${assetsPath}/mail-center-bottom.png) repeat-x -4px 0;background-size: auto 8px;"></td>
                  <td style="width:8px;height:8px;background:url(${assetsPath}/mail-right-bottom.png) no-repeat 0 0;background-size: 8px 8px;"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </center>
    </td>
  </tr>
</table>`
}
