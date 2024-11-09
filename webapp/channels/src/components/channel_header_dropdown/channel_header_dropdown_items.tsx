// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import type { Channel } from '@mattermost/types/channels';
import type { UserProfile } from '@mattermost/types/users';
import {
    ArchiveOutlineIcon,
    InformationOutlineIcon,
    BellOffOutlineIcon,
    BellOutlineIcon,
    AccountOutlineIcon,
    LogoutVariantIcon,
} from '@mattermost/compass-icons/components';
import { Permissions } from 'mattermost-redux/constants';
import { isGuest } from 'mattermost-redux/utils/user_utils';
import ChannelMoveToSubMenuOld from 'components/channel_move_to_sub_menu_old';
import ChannelNotificationsModal from 'components/channel_notifications_modal';
import DeleteChannelModal from 'components/delete_channel_modal';
import ChannelPermissionGate from 'components/permissions_gates/channel_permission_gate';
import UnarchiveChannelModal from 'components/unarchive_channel_modal';
import Menu from 'components/widgets/menu/menu';

import MobileChannelHeaderPlug from 'plugins/mobile_channel_header_plug';
import { Constants, ModalIdentifiers } from 'utils/constants';
import { localizeMessage } from 'utils/utils';
import type { PluginComponent, Menu as PluginMenu } from 'types/store/plugins';
import MenuItemCloseChannel from './menu_items/close_channel';
import MenuItemCloseMessage from './menu_items/close_message';
import MenuItemLeaveChannel from './menu_items/leave_channel';
import MenuItemOpenMembersRHS from './menu_items/open_members_rhs';
import MenuItemToggleFavoriteChannel from './menu_items/toggle_favorite_channel';
import MenuItemToggleInfo from './menu_items/toggle_info';
import MenuItemToggleMuteChannel from './menu_items/toggle_mute_channel';
import MenuItemViewPinnedPosts from './menu_items/view_pinned_posts';
import { MdGridView } from 'react-icons/md';
import ChannelActionsMenu from 'components/channel_settings_submenu';
import NotChannelSubMenu from '../not_channel_submenu';
import DMChannelSubMenu from 'components/dm_channel_submenu';
import { Actions } from 'components/convert_gm_to_channel_modal';
import { ChannelInviteModal } from 'components/channel_invite_modal/channel_invite_modal';
import MoreDirectChannels from 'components/more_direct_channels/more_direct_channels';



export type Props = {
    user: UserProfile;
    channel?: Channel;
    isDefault: boolean;
    isFavorite: boolean;
    isReadonly: boolean;
    isMuted: boolean;
    isArchived: boolean;
    isMobile: boolean;
    penultimateViewedChannelName: string;
    pluginMenuItems: PluginComponent[];
    isLicensedForLDAPGroups: boolean;
    onExited: () => void;
    actions: Actions;
    profilesInChannel: UserProfile[];
    teammateNameDisplaySetting: string;
    currentUserId: string;
   
}

export default class ChannelHeaderDropdown extends React.PureComponent<Props> {
    render() {
        const {
            user,
            channel,
            isDefault,
            isFavorite,
            isMuted,
            isReadonly,
            isArchived,
            isMobile,
            penultimateViewedChannelName,
            isLicensedForLDAPGroups,
            actions,
            profilesInChannel,
            teammateNameDisplaySetting,
            currentUserId,
            onExited,
        } = this.props;

        if (!channel) {
            return null;
        }

        const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;
        const isGroupConstrained = channel.group_constrained === true;
        const channelMembersPermission = isPrivate ? Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS : Permissions.MANAGE_PUBLIC_CHANNEL_MEMBERS;
        const channelPropertiesPermission = isPrivate ? Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES : Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES;
        const channelDeletePermission = isPrivate ? Permissions.DELETE_PRIVATE_CHANNEL : Permissions.DELETE_PUBLIC_CHANNEL;
        const channelUnarchivePermission = Permissions.MANAGE_TEAM;

        let divider;
        if (isMobile) {
            divider = (
                <li className='MenuGroup mobile-menu-divider'>
                    <hr/>
                </li>
            );
        }

        const pluginItems = this.props.pluginMenuItems.map((item): PluginMenu => {
            return {
                id: item.id,
                text: item.text,
                icon: item.icon,
                action: item.action,
            }
        });

        return (
            <React.Fragment>
                <MenuItemToggleInfo
                    show={true}
                    channel={channel}
                    icon={<InformationOutlineIcon color='#808080' />}
                />
                <MenuItemToggleMuteChannel
                    id='channelToggleMuteChannel'
                    user={user}
                    channel={channel}
                    isMuted={isMuted}
                    icon={<BellOffOutlineIcon color='#808080' />}
                />
                <Menu.ItemToggleModalRedux
                    id='channelNotificationPreferences'
                    show={channel.type !== Constants.DM_CHANNEL && !isArchived}
                    modalId={ModalIdentifiers.CHANNEL_NOTIFICATIONS}
                    dialogType={ChannelNotificationsModal}
                    dialogProps={{
                        channel,
                        currentUser: user,
                    }}
                    text={localizeMessage({id:'navbar.preferences', defaultMessage:'Notification Preferences'})}
                    icon={<BellOutlineIcon color='#808080' />}
                />
                {(channel.type === Constants.OPEN_CHANNEL || isPrivate) && (
                    <ChannelActionsMenu
                        channel={channel}
                        isArchived={isArchived}
                        isDefault={isDefault}
                        isReadonly={isReadonly}
                    />
                )}
                {channel.type === Constants.GM_CHANNEL && (
                    <NotChannelSubMenu
                        channel={channel}
                        isArchived={isArchived}
                        isReadonly={isReadonly}
                        isGuest={isGuest(user.roles)}
                        actions={this.props.actions}
                        profilesInChannel={this.props.profilesInChannel}
                        teammateNameDisplaySetting={this.props.teammateNameDisplaySetting}
                        currentUserId={this.props.currentUserId}
                        onExited={this.props.onExited}
                        
                    />
                )}
                {channel.type === Constants.DM_CHANNEL && (
                    <DMChannelSubMenu
                        channel={channel}
                        isArchived={isArchived}
                        isReadonly={isReadonly}
                    />
                )}

                <Menu.Group divider={divider}>
                    <MenuItemToggleFavoriteChannel
                        show={isMobile}
                        channel={channel}
                        isFavorite={isFavorite}
                    />
                    <MenuItemViewPinnedPosts
                        show={isMobile}
                        channel={channel}
                    />
                    <Menu.ItemToggleModalRedux
                        id='channelNotificationPreferences'
                        show={channel.type !== Constants.DM_CHANNEL && !isArchived}
                        modalId={ModalIdentifiers.CHANNEL_NOTIFICATIONS}
                        dialogType={ChannelNotificationsModal}
                        dialogProps={{
                            channel,
                            currentUser: user,
                        }}
                        text={localizeMessage({id: 'navbar.preferences', defaultMessage: 'Notification Preferences'})}
                        icon={<BellOutlineIcon color='#808080'/>}
                    />
                    <MenuItemToggleMuteChannel
                        id='channelToggleMuteChannel'
                        user={user}
                        channel={channel}
                        isMuted={isMuted}
                        icon={<BellOffOutlineIcon color='#808080'/>}
                    />
                </Menu.Group>

                <Menu.Group divider={divider}>
                    <ChannelPermissionGate
                        channelId={channel.id}
                        teamId={channel.team_id}
                        permissions={[channelMembersPermission]}
                    >
                        <Menu.ItemToggleModalRedux
                            id='channelAddMembers'
                            show={channel.type !== Constants.DM_CHANNEL && channel.type !== Constants.GM_CHANNEL && !isArchived && !isDefault && !isGroupConstrained}
                            modalId={ModalIdentifiers.CHANNEL_INVITE}
                            dialogType={ChannelInviteModal}
                            dialogProps={{channel}}
                            text={localizeMessage({id: 'navbar.addMembers', defaultMessage: 'Add Members'})}
                        />
                        <Menu.ItemToggleModalRedux
                            id='channelAddMembers'
                            show={channel.type === Constants.GM_CHANNEL && !isArchived && !isGroupConstrained}
                            modalId={ModalIdentifiers.CREATE_DM_CHANNEL}
                            dialogType={MoreDirectChannels}
                            dialogProps={{isExistingChannel: true}}
                            text={localizeMessage({id: 'navbar.addMembers', defaultMessage: 'Add Members'})}
                        />
                    </ChannelPermissionGate>
                </Menu.Group>

                <Menu.Group divider={divider}>
                    <MenuItemOpenMembersRHS
                        id='channelViewMembers'
                        channel={channel}
                        show={channel.type !== Constants.DM_CHANNEL && channel.type !== Constants.GM_CHANNEL && (isArchived || isDefault)}
                        text={localizeMessage({id:'channel_header.Members', defaultMessage:' Members'})}
                        icon={<AccountOutlineIcon color='#808080' />}
                    />
                    <MenuItemOpenMembersRHS
                        id='channelViewMembers'
                        channel={channel}
                        show={channel.type === Constants.GM_CHANNEL}
                        text={localizeMessage({id:'channel_header.Members', defaultMessage:' Members'})}
                        icon={<AccountOutlineIcon color='#808080' />}
                    />
                    <ChannelPermissionGate
                        channelId={channel.id}
                        teamId={channel.team_id}
                        permissions={[channelMembersPermission]}
                        invert={true}
                    >
                    <MenuItemOpenMembersRHS
                        id='channelViewMembers'
                        channel={channel}
                        show={channel.type !== Constants.DM_CHANNEL && channel.type !== Constants.GM_CHANNEL && !isArchived && !isDefault}
                        text={localizeMessage({id:'channel_header.Members', defaultMessage:' Members'})}
                        icon={<AccountOutlineIcon color='#808080' />}
                    />
                    </ChannelPermissionGate>
                </Menu.Group>


              

                <Menu.Group>
                      {/* Remove when this components is migrated to new menus */}
                    <ChannelMoveToSubMenuOld
                        channel={channel}
                        openUp={false}
                        inHeaderDropdown={true}
                    />
                    <Menu.ItemSubMenu
                        id="pluginItems-submenu"
                        subMenu={pluginItems}
                        text={
                            <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
                                <MdGridView size={16}/>
                                {localizeMessage({id:'sidebar_left.sidebar_channel_menu.plugins',defaultMessage:' More Actions'})}
                            </span>
                        }
                        direction="right"

                    />
                </Menu.Group>
                <Menu.Group>
                    <MenuItemLeaveChannel
                        id='channelLeaveChannel'
                        channel={channel}
                        isDefault={isDefault}
                        isGuestUser={isGuest(user.roles)}
                        icon={<LogoutVariantIcon />}
                    />
                    <ChannelPermissionGate
                        channelId={channel.id}
                        teamId={channel.team_id}
                        permissions={[channelDeletePermission]}
                    >
                        <Menu.ItemToggleModalRedux
                            id='channelArchiveChannel'
                            show={!isArchived && !isDefault && channel.type !== Constants.DM_CHANNEL && channel.type !== Constants.GM_CHANNEL}
                            modalId={ModalIdentifiers.DELETE_CHANNEL}
                            className='MenuItem__dangerous'
                            dialogType={DeleteChannelModal}
                            dialogProps={{
                                channel,
                                penultimateViewedChannelName,
                            }}
                            text={localizeMessage({id:'channel_header.delete', defaultMessage:'Archive Channel'})}
                            icon={<ArchiveOutlineIcon />}
                        />
                    </ChannelPermissionGate>
                    {isMobile &&
                        <MobileChannelHeaderPlug
                            channel={channel}
                            isDropdown={true}
                        />}
                    <MenuItemCloseMessage
                        id='channelCloseMessage'
                        channel={channel}
                        currentUser={user}
                    />
                    <MenuItemCloseChannel
                        isArchived={isArchived}
                    />
                </Menu.Group>
                <Menu.Group divider={divider}>
                    <ChannelPermissionGate
                        channelId={channel.id}
                        teamId={channel.team_id}
                        permissions={[channelUnarchivePermission]}
                    >
                        <Menu.ItemToggleModalRedux
                            id='channelUnarchiveChannel'
                            show={isArchived && !isDefault && channel.type !== Constants.DM_CHANNEL && channel.type !== Constants.GM_CHANNEL}
                            modalId={ModalIdentifiers.UNARCHIVE_CHANNEL}
                            dialogType={UnarchiveChannelModal}
                            dialogProps={{
                                channel,
                            }}
                            text={localizeMessage({id: 'channel_header.unarchive', defaultMessage: 'Unarchive Channel'})}
                        />
                    </ChannelPermissionGate>
                </Menu.Group>
            </React.Fragment>
        );
    }
}

