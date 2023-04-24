import mongoose from "mongoose";

const acceptedMailServices = [
  "126",
  "163",
  "1und1",
  "AOL",
  "DebugMail",
  "DynectEmail",
  "FastMail",
  "GandiMail",
  "Gmail",
  "Godaddy",
  "GodaddyAsia",
  "GodaddyEurope",
  "hot.ee",
  "Hotmail",
  "iCloud",
  "mail.ee",
  "Mail.ru",
  "Maildev",
  "Mailgun",
  "Mailjet",
  "Mailosaur",
  "Mandrill",
  "Naver",
  "OpenMailBox",
  "Outlook365",
  "Postmark",
  "QQ",
  "QQex",
  "SendCloud",
  "SendGrid",
  "SendinBlue",
  "SendPulse",
  "SES",
  "SES-US-EAST-1",
  "SES-US-WEST-2",
  "SES-EU-WEST-1",
  "Sparkpost",
  "Yahoo",
  "Yandex",
  "Zoho",
  "qiye.aliyun",
];

const siteConfigSchema = new mongoose.Schema({
  openSignup: {
    type: Boolean,
    default: true,
  },
  mailService: {
    type: String,
    enum: acceptedMailServices,
  },
  mailUser: {
    type: String,
  },
  mailPass: {
    type: String,
  },
  mailFrom: {
    type: String,
  },
});

const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);

export { SiteConfig };
