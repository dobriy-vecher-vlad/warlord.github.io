import React from 'react';
import {
	Spacing,
	Panel,
	Group,
	CardGrid,
	Card,
	Cell,
	HorizontalScroll,
	TabsItem,
	Tabs,
	Spinner,
	Counter,
	Button,
	Placeholder,
	Checkbox,
	FormLayoutGroup,
	FormItem,
	Input,
	Select,
	Text,
	IconButton,
	File,
	Header,
	Banner,
	Avatar,
} from '@vkontakte/vkui';
import InfiniteScroll from "react-infinite-scroll-component";
import { Icon12ArrowUp, Icon16Clear, Icon16Picture, Icon16Up, Icon24Document, Icon56FragmentsOutline } from '@vkontakte/icons';
import Skeleton from '../../components/skeleton';

import Items from '../../data/items.json';

const enchantmentsMultiplier = [0.10, 0.15, 0.20, 0.25, 0.30, 0.10, 0.15, 0.20, 0.25, 0.30];
const enchantmentsChance = [100, 70, 35, 25, 10, 10, 10, 10, 10, 10];
const enchantmentsScrolls = [1, 3, 5, 7, 9, 12, 14, 16, 18, 20];
const tabs = [{
	id: 1,
	title: 'Хочу отдать',
	count: Items.length,
}, {
	id: 2,
	title: 'Хочу найти',
	count: 0,
}];

class PANEL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: null,
			isLoad: true,
			tabs: 1,
			settings: {
				columns: 6,
				countElements: true,
				nameElements: true, // false
				nameImage: false,
				image: false,
				blurImage: 0,
				missingElements: true,
				compactMode: false,
			},
		};
		this.Image = React.createRef();
		this._isMounted = false;
	};
	async updateItems(isUpgrade = false) {
		const { state } = this.props;
		const { getGame, server } = this.props.state;
		const { BotAPI, openSnackbar, setActivePanel } = this.props.options;
		this._isMounted && this.setState({ isLoad: true });
		let dataProfile;
		if (!this.state.profile || isUpgrade) {
			let api_uid = state.login || state.user.vk.id;
			let auth_key = state.auth;
			if (!auth_key) {
				auth_key = this._isMounted && await BotAPI('getAuth', null, null, null, {stage: 'modal', text: 'Для продолжения работы необходимо указать пароль авторизации'});
				if (auth_key == 'modal') {
					this._isMounted && setActivePanel('profile');
					return;
				} else if (!auth_key) {
					this._isMounted && setActivePanel('profile');
					return;
				}
			}
			this.state.getGameAuth = {
				login: api_uid,
				password: auth_key,
			};
			dataProfile = this._isMounted && await getGame(server, {}, this.state.getGameAuth);
			if (!dataProfile?.u || !dataProfile.i.length) {
				openSnackbar({text: 'Пароль авторизации игры неисправен, введите новый', icon: 'error'});
				this._isMounted && BotAPI('getAuth', null, null, null, {stage: 'modal', text: 'Пароль авторизации игры неисправен, введите новый', error: typeof dataProfile == 'string' ? dataProfile : dataProfile?.err_msg ? dataProfile?.err_msg : JSON.stringify(dataProfile)});
				this._isMounted && setActivePanel('profile');
				return;
			}
			this.state.getGameAuth.id = dataProfile?.u?._id || api_uid;
			this.state.profile = dataProfile;
		} else dataProfile = this.state.profile;

		this.state.resources.map(resource => resource.count = Number(dataProfile.u[`_${resource?.id}`]) || 0);
		this.state.items = [];
		let resource = this.state.resources.find(resource => resource.id == this.state.tabs);
		dataProfile.i.filter(item => Number(item._o) == 1)?.map(item => {
			try {
				let _item = Items.find(_item => _item.id == Number(item._id));
				_item.lvl = Number(item._u) || 0;
				if (resource.id == 'm9') {
					_item.scrolls = 0;
					if (_item.lvl < 5 || _item.lvl >= 10 || resource.count < enchantmentsScrolls[_item.lvl]) return;
				} else {
					if (`m${_item.currency}` != resource.id) return;
					_item.scrolls = Number(dataProfile?.iupgrade?.i?.find(item => Number(item._id) == Number(_item.id))?._cnt) || 0;
					if (_item.lvl >= 5 || _item.scrolls < [...enchantmentsScrolls].splice(0, 5)?.[_item.lvl]) return;
				}
				_item.prices = enchantmentsMultiplier.map((multiplier) => Math.ceil((_item.dmg + _item.hp) * multiplier) * (this.state.resources.find(resource => resource.id == `m${_item.currency}`)?.multiplier || 1));
				if (this.state.resources.find(resource => resource.id == `m${_item.currency}`)?.count < _item.prices[_item.lvl]) return;
				_item.enchantments = {
					dmg: enchantmentsMultiplier.map((multiplier) => Math.ceil(_item.dmg * multiplier || 0)),
					hp: enchantmentsMultiplier.map((multiplier) => Math.ceil(_item.hp * multiplier || 0)),
				};
				this.state.items.push(_item);
			} catch (error) { }
		});
		let allItems = this.state.items.sort((a, b) => b.lvl - a.lvl);
		this.setState({ currentItems: allItems.slice(0, 30), allItems });
		this._isMounted && this.setState({ isLoad: false });
	};
	async upgradeItem(item) {
		const { getGame, server } = this.props.state;
		const { openSnackbar } = this.props.options;
		this.setState({ isLoad: true });
		let data = this._isMounted && await getGame(server, {
			i: 26,
			t1: item.id,
		}, this.state.getGameAuth);
		if (data?.a?._res) {
			if (data?.msg == 'Недостаточно ресурсов.') {
				openSnackbar({text: 'Недостаточно ресурсов для улучшения предмета', icon: 'error'});
			} else if (Number(data.a._res) == 1) {
				openSnackbar({text: 'Удачная попытка улучшения предмета', icon: 'done'});
			} else if (Number(data.a._res) == 2) {
				openSnackbar({text: 'Неудачная попытка улучшения предмета', icon: 'error'});
			// } else openSnackbar({text: 'Неизвестная ошибка при улучшении предмета', icon: 'error'});
			} else openSnackbar({text: icon, icon: 'error'});
		// } else openSnackbar({text: 'Неизвестная ошибка при улучшении предмета', icon: 'error'});
		} else openSnackbar({text: data, icon: 'error'});
		await this.updateItems(true);
		this.setState({ activeItem: item.id });
		this.setState({ isLoad: false });
	};
	async componentDidMount() {
		console.log('[PANEL] >', this.props.id);
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
		this._isMounted = true;
		// await this.updateItems();
		this._isMounted && this.setState({ isLoad: false });
	};
	async componentDidUpdate() {
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
	};
	async componentWillUnmount () {
		this._isMounted = false;
	};
	async shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.state.snackbar!=this.state.snackbar&&nextState.snackbar==this.state.snackbar) this.setState({ snackbar: nextProps.state.snackbar });
		if (nextState.snackbar!=this.state.snackbar) return true;
		return false;
	};
	render() {
		const { state, options, parent } = this.props;
		const { currentItems, allItems } = this.state;
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord-helper/media/images/';
		const title = 'Коллекции';
		const description = 'Мой профиль';
		const avatar = 'labels/20.png';
		return (
			<Panel id={this.props.id}>
				{!state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
				<Group className={this.state.isLoad ? 'State--isLoad' : ''}>
					<div className='Sticky Sticky__top withSeparator'>
						{state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
						{!this.state.isLoad || currentItems ? <Tabs mode="default">
							<HorizontalScroll getScrollToLeft={i => i - 240} getScrollToRight={i => i + 240}>
								{tabs.map((tab, x) => <TabsItem key={tab.id} status={<div className="vkuiTabsItem__status--count vkuiSubhead vkuiSubhead--sizeY-compact vkuiSubhead--w-2">{options.numberSpaces(tab.count, ' ')}</div>} onClick={() => this.setState({ tabs: tab.id })} selected={this.state.tabs === tab.id}>{tab.title}</TabsItem>)}
							</HorizontalScroll>
						</Tabs> : <Skeleton height={state.isDesktop ? 44 : 48} marginLeft={state.isDesktop ? 0 : 8} marginRight={state.isDesktop ? 0 : 8} width="auto"/>}
						<Spacing size={8} style={{padding: 0, marginTop: 0}}/>
					</div>
					{this.state.tabs == 1 ? <>
						<div className='CustomFormLayoutGroup'>
							<Header mode="primary">Общее</Header>
							<FormLayoutGroup mode="horizontal" segmented>
								<Text>Заголовок</Text>
								<Input
									type="text"
									placeholder="Введите текст"
									onChange={(event) => this.setState(prevState => ({
										settings: {
											...prevState.settings,
											nameImage: event.target.value,
										}
									}))}
									value={this.state.settings.nameImage || ''}
									after={this.state.settings.nameImage ? <IconButton
										hoverMode="opacity"
										aria-label="Очистить поле"
										onClick={() => this.setState(prevState => ({
											settings: {
												...prevState.settings,
												nameImage: false,
											}
										}))}
									><Icon16Clear/></IconButton> : false}
								/>
							</FormLayoutGroup>
							<FormLayoutGroup mode="horizontal" segmented>
								<Text>Количество столбцов</Text>
								<Select
									options={new Array(10).fill().map((item, key) => key+1).map((param, key) => ({ label: `${param} ${options.numberForm(param, ['столбец', 'столбца', 'столбцов'])}`, value: key }))}
									value={this.state.settings.columns-1}
									onChange={(event) => this.setState(prevState => ({
										settings: {
											...prevState.settings,
											columns: Number(event.target.value)+1,
										}
									}))}
								/>
							</FormLayoutGroup>
							<FormLayoutGroup mode="horizontal" segmented>
								<Text>Подписывать название коллекции</Text>
								<Select
									options={['Нет', 'Да'].map((param, key) => ({ label: param, value: key }))}
									value={this.state.settings.nameElements}
									onChange={(event) => this.setState(prevState => ({
										settings: {
											...prevState.settings,
											nameElements: Number(event.target.value),
										}
									}))}
								/>
							</FormLayoutGroup>
						</div>
						<div className='CustomFormLayoutGroup'>
							<Header mode="primary">Задний фон</Header>
							<FormLayoutGroup mode="horizontal" segmented>
								<Text>Изображение</Text>
								<File
									before={<Icon16Picture role="presentation" />}
									after={this.state.settings.image ? <span>{this.state.settings.image}</span> : undefined}
									size="l"
									align="center"
									stretched={true}
									mode="secondary"
									accept="image/png, image/jpeg, image/jpg"
									onChange={(event) => {
										let file = event?.target?.files?.[0] || false;
										if (!FileReader) return;
										if (!file) return;
										if (!file.type.startsWith('image/')) return;
										console.warn(file);
										let fileReader = new FileReader();
										fileReader.onload = () => {
											this.setState(prevState => ({
												settings: {
													...prevState.settings,
													image: file?.name || 'Неизвестное название',
												}
											}), () => this.Image.current.src = fileReader.result);
										};
										fileReader.readAsDataURL(file);
									}}
								/>
							</FormLayoutGroup>
							<FormLayoutGroup mode="horizontal" segmented>
								<Text>Размытие</Text>
								<Select
									options={new Array(11).fill().map((item, key) => key).map((param, key) => ({ label: param ? `${param} степень` : 'Отключено', value: key }))}
									value={this.state.settings.blurImage}
									onChange={(event) => this.setState(prevState => ({
										settings: {
											...prevState.settings,
											blurImage: Number(event.target.value),
										}
									}))}
								/>
							</FormLayoutGroup>
						</div>
						<div className='CustomFormLayoutGroup'>
							<Header mode="primary">Элементы</Header>
							<FormLayoutGroup mode="horizontal" segmented>
								<Text>Подписывать количество элементов</Text>
								<Select
									options={['Нет', 'Да'].map((param, key) => ({ label: param, value: key }))}
									value={this.state.settings.countElements}
									onChange={(event) => this.setState(prevState => ({
										settings: {
											...prevState.settings,
											countElements: Number(event.target.value),
										}
									}))}
								/>
							</FormLayoutGroup>
							<FormLayoutGroup mode="horizontal" segmented>
								<Text>Показывать отсутствующие элементы</Text>
								<Select
									options={['Нет', 'Да'].map((param, key) => ({ label: param, value: key }))}
									value={this.state.settings.missingElements}
									onChange={(event) => this.setState(prevState => ({
										settings: {
											...prevState.settings,
											missingElements: Number(event.target.value),
										}
									}))}
								/>
							</FormLayoutGroup>
							<FormLayoutGroup mode="horizontal" segmented>
								<Text>Компактный режим</Text>
								<Select
									options={['Нет', 'Да'].map((param, key) => ({ label: param, value: key }))}
									value={this.state.settings.compactMode}
									onChange={(event) => this.setState(prevState => ({
										settings: {
											...prevState.settings,
											compactMode: Number(event.target.value),
										}
									}))}
								/>
							</FormLayoutGroup>
						</div>
						<Spacing size={16} separator />
						<div className="ImagePreview">
							<div className="ImagePreview__container">
								<div className="ImagePreview__in" style={{ gridTemplateColumns: `repeat(${this.state.settings.columns}, 1fr)` }}>
									{Items.filter(item => item.fragments.length).slice(0, 40).map((collection, key) => <React.Fragment key={key}>
										<div className={['CollectionStack', this.state.settings.compactMode ? 'CollectionStack--compact' : false].filter(className => className).join(' ')} title={collection.title}>
											{this.state.settings.nameElements ? <div className="CollectionStack__header">{collection.title}</div> : false}
											<div className="CollectionStack__in">
												{collection.fragments.map((fragment, key) => <React.Fragment key={key}>
													<Avatar className={['CollectionStack__item', this.state.settings.missingElements ? key%2 ? 'CollectionStack__item--missing' : false : false].filter(className => className).join(' ')} badge={this.state.settings.countElements ? <>12</> : false} src={`${pathImages}collections/${Number(fragment)}.png`}/>
												</React.Fragment>)}
											</div>
										</div>
									</React.Fragment>)}
									<div className="ImagePreview__image">{this.state.settings.image ? <img ref={this.Image} alt="ImagePreview__image"/> : false}</div>
								</div>
							</div>
						</div>
						<div className='Sticky Sticky__bottom withSeparator'>
							<Spacing size={8} />
							<div style={{
								display: 'flex',
								gap: 8,
							}}>
								<Button size="m" onClick={() => console.log('save')} stretched mode="commerce">Сохранить изображение</Button>
								<Button size="m" onClick={() => console.log('open')} stretched mode="secondary">Открыть в новом окне</Button>
							</div>
						</div>
					</> : this.state.tabs == 2 ? <>
						2
					</> : false}
				</Group>
				{this.state.snackbar}
			</Panel>
		);
	};
};
export default PANEL;