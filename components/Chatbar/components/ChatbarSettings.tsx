import {
  IconCreditCard,
  IconFileExport,
  IconHistory,
  IconSettings,
} from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import useApiService from '@/services/useApiService';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';

import { Import } from '../../Settings/Import';
import { Key } from '../../Settings/Key';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { PluginKeys } from './PluginKeys';

import { Button, Modal, Space } from 'antd';

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');

  const { getBalance } = useApiService();

  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>('');
  const [errorModal, setErrorModal] = useState<any>(null);

  // 默认关闭上下文
  if (localStorage.getItem('withContext') === null) {
    localStorage.setItem('withContext', 'false');
  }

  const [withContext, setWithContext] = useState<boolean>(
    localStorage.getItem('withContext') === 'true',
  );

  const {
    state: {
      apiKey,
      lightMode,
      serverSideApiKeyIsSet,
      serverSidePluginKeysSet,
      conversations,
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
    handleApiKeyChange,
  } = useContext(ChatbarContext);

  const changeWithContext = () => {
    localStorage.setItem('withContext', (!withContext).toString());
    setWithContext(!withContext);
  };

  // 更新余额
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getBalance(
      {
        key: apiKey,
      },
      signal,
    ).then((res) => {
      if (res?.data?.credit) {
        const balance = Number(+res.data.credit / 10000).toFixed(2);
        setBalance(balance);

        if (+balance < 5) {
          errorModal && errorModal.destroy();

          const modal = Modal.error({
            title: '余额不足',
            content: '前往充值',
            okText: '前往',
            onOk() {
              window.open(
                'https://openai-sb.com/guide/pricing.html#%E5%85%85%E5%80%BC%E4%B8%8E%E6%9F%A5%E7%9C%8B%E4%BD%99%E9%A2%9D',
              );
            },
          });

          setErrorModal(modal);
        }
      }
    });

    return () => {
      controller.abort();
    };
  }, [apiKey]);

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}

      <Import onImport={handleImportConversations} />

      <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData()}
      />

      <SidebarButton
        text={t('Settings')}
        icon={<IconSettings size={18} />}
        onClick={() => setIsSettingDialog(true)}
      />

      <SidebarButton
        text={withContext ? '关闭上下文' : '开启上下文'}
        icon={<IconHistory size={18} />}
        onClick={() => changeWithContext()}
      />

      {!serverSideApiKeyIsSet ? (
        <Key apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
      ) : null}

      {/* <SidebarButton
        text={`余额：${balance}元`}
        icon={<IconCreditCard size={18} />}
        onClick={() => {}}
      /> */}

      {/* {!serverSidePluginKeysSet ? <PluginKeys /> : null} */}

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />
    </div>
  );
};
