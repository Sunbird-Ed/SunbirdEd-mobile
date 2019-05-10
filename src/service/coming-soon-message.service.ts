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

  async getComingSoonMessage() {
    const currentChannelId = await this.frameworkService.getActiveChannelId().toPromise();
    const systemSettings =
      await this.systemSettingsService.getSystemSettings({id: SystemSettingsIds.CONTENT_COMING_SOON_MSG}).toPromise();
    const selectedLanguage =
      await this.sharedPreferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise();

    const tenantMessages: { rootOrgId: string, translations: string, value: string }[] = JSON.parse(systemSettings.value);

    const tennatMessage = tenantMessages.find((message) => message.rootOrgId === currentChannelId);
    if (tennatMessage) {
      const tenantMessageTranslations = JSON.parse(tennatMessage.translations);
      return tenantMessageTranslations[selectedLanguage] || tennatMessage.value;
    }
    return this.commonUtilService.translateMessage('CONTENT_COMMING_SOON');
  }
}
