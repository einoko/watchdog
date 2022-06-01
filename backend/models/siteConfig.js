import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
  openSignup: {
    type: Boolean,
    default: true,
  },
});

const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);

export { SiteConfig };
