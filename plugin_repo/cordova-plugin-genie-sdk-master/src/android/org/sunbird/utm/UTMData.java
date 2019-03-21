package org.sunbird.utm;



public class UTMData {

    private String action;  //INSTALL,LAUNCH etc
    private String utmsource;
    private String utmmedium;
    private String utmterm;
    private String utmcontent;
    private String utmcampaign;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getUtmsource() {
        return utmsource;
    }

    public void setUtmsource(String utmsource) {
        this.utmsource = utmsource;
    }

    public String getUtmmedium() {
        return utmmedium;
    }

    public void setUtmmedium(String utmmedium) {
        this.utmmedium = utmmedium;
    }

    public String getUtmterm() {
        return utmterm;
    }

    public void setUtmterm(String utmterm) {
        this.utmterm = utmterm;
    }

    public String getUtmcontent() {
        return utmcontent;
    }

    public void setUtmcontent(String utmcontent) {
        this.utmcontent = utmcontent;
    }

    public String getUtmcampaign() {
        return utmcampaign;
    }

    public void setUtmcampaign(String utmcampaign) {
        this.utmcampaign = utmcampaign;
    }
}
