import React, { useEffect } from 'react';
import DashboardLayout from 'components/layout/DashboardLayout';
import { Toast } from '@linen/ui';
import { SerializedAccount } from '@linen/types';
import type { channels, AccountType } from '@prisma/client';
import LinkCard from './Settings/LinkCard';
import ChannelsDefault from './Settings/ChannelsDefault';
import CommunityTypeCard from './Settings/CommunityTypeCard';
import ChannelVisibilityCard from './Settings/ChannelVisibilityCard';
import CommunityIntegration from './Settings/CommunityIntegration';
import AnonymizeCard from './Settings/AnonymizeCard';
import URLs from './Settings/Urls';
import ImportFromSlack from './Settings/ImportFromSlack';
import debounce from '@linen/utilities/debounce';
import { ForbiddenCard } from './Settings/ForbiddenCard';
import { useRouter } from 'next/router';

export interface SettingsProps {
  account?: SerializedAccount;
  channels?: channels[];
  forbidden?: boolean;
}

const updateAccount = debounce(
  ({ communityId, type }: { communityId: string; type: string }) => {
    fetch('/api/accounts', {
      method: 'PUT',
      body: JSON.stringify({
        communityId,
        type,
      }),
    })
      .then((response) => {
        if (!response.ok) throw response;
        Toast.success('Saved successfully!');
      })
      .catch(() => {
        Toast.error('Something went wrong!');
      });
  },
  250,
  { leading: true }
);

export function WaitForIntegration() {
  return <p className="text-sm text-gray-400">Waiting for integration</p>;
}

export default function Settings(props: SettingsProps) {
  const router = useRouter();

  useEffect(() => {
    const error = router.query.error as string;
    if (error) {
      Toast.error('Something went wrong, please try again');
      router.replace(window.location.pathname, undefined, { shallow: true });
    }
    const forbidden = router.query.forbidden as string;
    if (forbidden) {
      Toast.info(
        'Your current role does not have enough permissions to access this page'
      );
      router.replace(window.location.pathname, undefined, { shallow: true });
    }
    const success = router.query.success as string;
    if (success) {
      Toast.success(decodeURI(success));
      router.replace(window.location.pathname, undefined, { shallow: true });
    }
  }, [router.query, router]);

  if (props.forbidden)
    return (
      <DashboardLayout header="Settings">
        <ForbiddenCard />
        <LinkCard {...props} />
      </DashboardLayout>
    );
  return (
    <DashboardLayout header="Settings" account={props.account}>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 divide-y divide-gray-200 divide-solid">
          <LinkCard {...props} />
          <CommunityIntegration {...props} />
          <ImportFromSlack {...props} />
          <AnonymizeCard {...props} />
          <ChannelsDefault {...props} />
          <ChannelVisibilityCard {...props} />
          <URLs {...props} />
          {props.account && (
            <CommunityTypeCard
              type={props.account.type}
              disabled={!props.account.premium}
              onChange={(type: AccountType) => {
                updateAccount({ communityId: props.account?.id, type });
              }}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
