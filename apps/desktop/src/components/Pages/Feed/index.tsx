import React from 'react';
import styles from './index.module.scss';
import Title from './Title';
import Header from './Header';
import Content from './Content';
import { FiRss } from 'react-icons/fi';
import { Nav } from '@linen/ui';
import { CommunityType } from '@linen/types';

interface Props {
  fetchFeed(): Promise<any>;
  fetchThread(): Promise<any>;
  fetchTotal(): Promise<any>;
  putThread(): Promise<any>;
}

export default function Dashboard({
  fetchFeed,
  fetchThread,
  fetchTotal,
  putThread,
}: Props) {
  const permissions = {
    access: false,
    feed: false,
    chat: false,
    manage: false,
    is_member: false,
    channel_create: false,
    accountId: null,
    token: null,
    user: null,
    auth: null,
  };
  const settings = {
    communityId: '1234',
    communityType: CommunityType.linen,
    communityName: 'linen',
    name: 'linen',
    brandColor: '#000000',
    homeUrl: 'https://linen.dev',
    docsUrl: 'https://linen.dev/docs',
    logoUrl: 'https://linen.dev/logo.png',
    communityUrl: null,
    communityInviteUrl: null,
  };
  return (
    <div className={styles.container}>
      <Title />
      <Header />
      <div className={styles.main}>
        <Nav className={styles.nav}>
          <Nav.Item active>
            <FiRss /> Feed
          </Nav.Item>
        </Nav>
        <Content
          fetchFeed={fetchFeed}
          fetchThread={fetchThread}
          putThread={putThread}
          fetchTotal={fetchTotal}
          isSubDomainRouting={false}
          permissions={permissions}
          settings={settings}
        />
      </div>
    </div>
  );
}
