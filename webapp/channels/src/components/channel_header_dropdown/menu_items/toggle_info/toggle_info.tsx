// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import type {Channel} from '@mattermost/types/channels';

import Menu from 'components/widgets/menu/menu';

type Action = {
    closeRightHandSide: () => void;
    showChannelInfo: (channelId: string) => void;
};

type Props = {
    show: boolean;
    channel: Channel;
    rhsOpen: boolean;
    actions: Action;
    icon:React.ReactElement;
};

const ToggleInfo = ({show, channel, rhsOpen, actions,icon}: Props) => {
    const intl=useIntl();
    const toggleRHS = () => {
        if (rhsOpen) {
            actions.closeRightHandSide();
            return;
        }
        actions.showChannelInfo(channel.id);
    };

    let text;
    if (rhsOpen) {
        text = intl.formatMessage({id: 'channelHeader.hideInfo', defaultMessage: 'Close Info'});
    } else {
        text = intl.formatMessage({id: 'channelHeader.viewInfo', defaultMessage: 'View Info'});
    }

    return (
        <Menu.ItemAction
            show={show}
            onClick={toggleRHS}
            text={
            <span style={{display:'inline-flex',verticalAlign:'centre'}}>
            {text}
            </span>}
            icon={
                <span style={{display:'inline-flex,',verticalAlign:'centre'}}>
                    {icon}
                </span>
            }
        />
    );
};

export default ToggleInfo;
