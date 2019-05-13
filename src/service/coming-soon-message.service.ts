import {Inject, Injectable} from "@angular/core";
import {
  FrameworkService,
  SharedPreferences,
  SystemSettingsService
} from "sunbird-sdk";
import {PreferenceKey, SystemSettingsIds} from "@app/app";
import {CommonUtilService} from "@app/service/common-util.service";

@Injectable()
export class ComingSoonMessageService {
  constructor(
    @Inject('FRAMEWORK_SERVICE') private frameworkService: FrameworkService,
    @Inject('SHARED_PREFERENCES') private sharedPreferences: SharedPreferences,
    @Inject('SYSTEM_SETTINGS_SERVICE') private systemSettingsService: SystemSettingsService,
    private commonUtilService: CommonUtilService
  ) {
  }

  async getComingSoonMessage(textBookUnitChannelId: any) {
    const currentChannelId = await this.frameworkService.getActiveChannelId().toPromise();
    if(textBookUnitChannelId) {
      const systemSettings =
        await this.systemSettingsService.getSystemSettings({id: SystemSettingsIds.CONTENT_COMING_SOON_MSG}).toPromise();
      const selectedLanguage =
        await this.sharedPreferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise();

      const tenantMessages: { rootOrgId: string, translations: string, value: string }[] = JSON.parse(systemSettings.value);

      const tenantMessage = tenantMessages.find((message) => message.rootOrgId === currentChannelId);
      if (tenantMessage) {
        const tenantMessageTranslations = JSON.parse(tenantMessage.translations);
        return tenantMessageTranslations[selectedLanguage!] || tenantMessage.value;
      }
    }
    return this.commonUtilService.translateMessage('CONTENT_IS_BEEING_ADDED');
  }
}
