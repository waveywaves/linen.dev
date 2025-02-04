import React, { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { FiBarChart, FiMenu, FiHash, FiRss, FiLogOut } from 'react-icons/fi';
import Link from 'components/Link/InternalLink';
import Modal from 'components/Modal';
import styles from './index.module.scss';
import { Permissions, SerializedChannel } from '@linen/types';
import { signOut } from 'next-auth/react';
import usePath from 'hooks/path';

interface Props {
  channels: SerializedChannel[];
  channelName?: string;
  fontColor: string;
  permissions: Permissions;
}

export default function MobileMenu({
  channels,
  channelName,
  permissions,
  fontColor,
}: Props) {
  const [show, setOpen] = useState(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);
  const router = useRouter();

  const paths = {
    feed: usePath({ href: '/feed' }),
    metrics: usePath({ href: '/metrics' }),
  };

  return (
    <>
      <FiMenu
        className={styles.open}
        style={{ color: fontColor }}
        onClick={open}
      />
      <Modal open={show} close={close} fullscreen>
        <div className={styles.header}>
          <div className={styles.text}>Pages</div>
          <FiMenu className={styles.close} onClick={close} />
        </div>
        <ul className={styles.list}>
          {permissions.feed && (
            <li>
              <Link
                onClick={close}
                className={classNames(styles.link, {
                  [styles.active]: paths.feed === router.asPath,
                })}
                href="/feed"
              >
                <FiRss /> Feed
              </Link>
            </li>
          )}
          {permissions.manage && (
            <li>
              <Link
                onClick={close}
                className={classNames(styles.link, {
                  [styles.active]: paths.metrics === router.asPath,
                })}
                href="/metrics"
              >
                <FiBarChart /> Metrics
              </Link>
            </li>
          )}
          <li className={styles.subheader}>Channels</li>
          {channels
            .sort((a, b) => a.channelName.localeCompare(b.channelName))
            .map((channel, index) => {
              return (
                <li key={channel.channelName + index}>
                  <Link
                    className={classNames(styles.link, {
                      [styles.active]: channel.channelName === channelName,
                    })}
                    onClick={close}
                    href={`/c/${channel.channelName}`}
                  >
                    <FiHash /> {channel.channelName}
                  </Link>
                </li>
              );
            })}
          {permissions.user && permissions.is_member && (
            <li className={styles.subheader}>Actions</li>
          )}
          {permissions.user && permissions.is_member && (
            <li
              onClick={() => {
                close();
                signOut();
              }}
              className={styles.link}
            >
              <FiLogOut /> Sign Out
            </li>
          )}
        </ul>
      </Modal>
    </>
  );
}
