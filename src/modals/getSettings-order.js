import React from 'react';
import {
	Div,
	ModalPageHeader,
	PanelHeaderSubmit,
	ModalPage,
	List,
	Cell,
	Avatar,
	PanelHeaderButton,
	Footer,
} from '@vkontakte/vkui';

import Skeleton from '../components/skeleton';
import { Icon28CrownOutline } from '@vkontakte/icons';

class MODAL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profiles: this.props.storeProfiles.filter(profile => profile.id && !profile.main),
			profilesFull: this.props.storeProfilesFull.filter(profile => profile.id && !profile.main),
			storeProfilesDeleted: undefined,
		};
	};
	removeProfiles = async(x) => {
		let count = Number((await this.props.options.Storage({key: 'storeProfilesDeleted', defaultValue: '0'})).value) || 0;
		console.warn({count});
		if (count <= 5) {
			await this.props.options.Storage({key: 'storeProfilesDeleted', value: String(count+1)});
			const _profiles = [...this.state.profiles];
			_profiles.splice(x, 1);
			const _profilesFull = [...this.state.profilesFull];
			_profilesFull.splice(x, 1);
			this.setState({ profiles: _profiles, profilesFull: _profilesFull });
		} else {
			this.props.options.CloseModal();
			this.props.options.openSnackbar({text: 'Превышен лимит удаления', icon: 'error'});
		}
		this.setState({ storeProfilesDeleted: count });
	};
	reorderProfiles = ({ from, to }) => {
		const _profiles = [...this.state.profiles];
		_profiles.splice(from, 1);
		_profiles.splice(to, 0, this.state.profiles[from]);
		const _profilesFull = [...this.state.profilesFull];
		_profilesFull.splice(from, 1);
		_profilesFull.splice(to, 0, this.state.profilesFull[from]);
		this.setState({ profiles: _profiles, profilesFull: _profilesFull });
	};
	saveProfiles = () => {
		const _profiles = [...this.state.profiles];
		_profiles.unshift(this.props.storeProfiles[0]);
		Array.prototype.push.apply(_profiles, new Array(this.props.storeProfiles.length-_profiles.length).fill({ id: null }));
		this.props.setState({ storeProfiles: _profiles });
		this.props.options.BackModal();
		this.props.options.storeProfilesRefresh();
	};
	async componentDidMount() {
		console.log('[MODAL] >', this.props.id);
		let count = Number((await this.props.options.Storage({key: 'storeProfilesDeleted', defaultValue: '0'})).value) || 0;
		this.setState({ storeProfilesDeleted: count });
	};
	render() {
		const { setState, state, options } = this.props;
		const { profiles, profilesFull, storeProfilesDeleted } = this.state;
		return (
			<ModalPage
				settlingHeight={100}
				className="ModalPage--classic"
				id={this.props.id}
				header={<ModalPageHeader
					before={<PanelHeaderButton onClick={() => options.BackModal()}>Отмена</PanelHeaderButton>}
					after={<PanelHeaderSubmit onClick={() => this.saveProfiles()}/>}
				>Редактирование</ModalPageHeader>}
			>
				<Div style={{ paddingTop: 'var(--vkui--size_base_padding_vertical--regular,12px)', paddingBottom: 'var(--vkui--size_base_padding_vertical--regular,12px)' }}>
					<List>
						{profilesFull.length ? profilesFull.map((profile, x) => {
							if (storeProfilesDeleted == undefined) {
								return (<Skeleton key={x} height={59} borderRadius={0}/>);
							} else {
								let server = state.serverHub.find(server => server.id == profile.server);
								return (<Cell
									key={x}
									mode={storeProfilesDeleted <= 5 ? "removable" : undefined}
									removePlaceholder="Удалить профиль"
									subtitle={`Королевство ${server?.name || 'Эрмун'}`}
									draggable
									before={<Avatar src={profile.photo_100 || 'https://vk.com/images/camera_200.png'} />}
									onRemove={() => this.removeProfiles(x)}
									onDragFinish={({ from, to }) => this.reorderProfiles({ from, to })}
								>{profile.first_name} {profile.last_name}</Cell>);
							}
						}) : this.props.storeProfilesFull.filter(profile => profile.main).map((profile, x) => {
							let server = state.serverHub.find(server => server.id == profile.server);
							return (<Cell
								key={x}
								disabled
								subtitle={`Королевство ${server?.name || 'Эрмун'}, нельзя удалить`}
								before={<Avatar src={profile.photo_100 || 'https://vk.com/images/camera_200.png'} />}
								after={<Icon28CrownOutline/>}
							>{profile.first_name} {profile.last_name}</Cell>);
						})}
					</List>
					<Footer>{profiles.length+1} из {this.props.storeProfilesSize} {options.numberForm(this.props.storeProfilesSize, ['слот', 'слота', 'слотов'])},<br/>возможно удалить {storeProfilesDeleted <= 5 ? 6 - storeProfilesDeleted : 0} {this.props.options.numberForm(storeProfilesDeleted <= 5 ? 6 - storeProfilesDeleted : 0, ['профиль', 'профиля', 'профилей'])}</Footer>
				</Div>
			</ModalPage>
		);
	};
};
export default MODAL;