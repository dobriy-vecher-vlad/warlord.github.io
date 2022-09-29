import React from 'react';
import {
	Panel,
	Group,
	Spacing,
	SimpleCell,
	CardGrid,
	Card,
	Avatar,
	Button,
	Radio,
	Placeholder,
	Slider,
} from '@vkontakte/vkui';
import { Icon28ListOutline } from '@vkontakte/icons';
import Skeleton from '../../components/skeleton';

import dataArena from '../../data/arena.json';

let syncBot = {
	arena: null,
	isStart: false
};
let api_id = 5536422;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class PANEL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: null,

			isLoad: false,
			isPause: false,
			
			botLog: <Placeholder
				style={{overflow: "hidden"}}
				icon={<Icon28ListOutline width={56} height={56} />}
				stretched
			>
				Нет новых<br />действий
			</Placeholder>,
			botSettings: {
				useEnergy: false,
				useGold: true,
				useLoss: true,
				useChest: false,
			},
			tryLimit: 20,
		};
		this._isMounted = false;
	};
	updateSelect = async(el) => {
		let botSettings = {};
		if (el?.customSelect) {
			botSettings = {
				...this.state.botSettings,
				...el.customSelect,
			}
		} else {
			if (el?.target?.name == 'skipMode') botSettings = {
				...this.state.botSettings,
				useEnergy: Number(el.target.value) == 1 ? true : false,
				useGold: Number(el.target.value) == 2 ? true : false,
			};
			if (el?.target?.name == 'endMode') botSettings = {
				...this.state.botSettings,
				useLoss: Number(el.target.value) == 1 ? true : false,
				useChest: Number(el.target.value) == 2 ? true : false,
			};
		}
		this._isMounted && this.setState({ botSettings }, async() => this._isMounted && await this.props.options.Storage({key: 'arenaSettings', value: JSON.stringify({
			...this.state.botSettings,
			tryLimit: this.state.tryLimit
		})}));
	};
	getLeague = (cups) => {
		// console.log(cups);
		// console.log(syncBot.arena.player);
		cups = Number(cups);
		let league = {
			id: 0,
			price: 0,
			cups: cups
		};
		if (cups < dataArena.league[0].to) {
			league = {
				...league,
				id: 1,
				price: dataArena.league[0].price
			};
		} else if (cups < dataArena.league[1].to) {
			league = {
				...league,
				id: 2,
				price: dataArena.league[1].price
			};
		} else if (cups < dataArena.league[2].to) {
			league = {
				...league,
				id: 3,
				price: dataArena.league[2].price
			};
		} else if (cups < dataArena.league[3].to) {
			league = {
				...league,
				id: 4,
				price: dataArena.league[3].price
			};
		} else if (cups < dataArena.league[4].to) {
			league = {
				...league,
				id: 5,
				price: dataArena.league[4].price
			};
		} else if (cups < dataArena.league[5].to) {
			league = {
				...league,
				id: 6,
				price: dataArena.league[5].price
			};
		} else if (cups < dataArena.league[6].to) {
			league = {
				...league,
				id: 7,
				price: dataArena.league[6].price
			};
		} else if (cups < dataArena.league[7].to) {
			league = {
				...league,
				id: 8,
				price: dataArena.league[7].price
			};
		} else {
			league = {
				...league,
				id: 9,
				price: dataArena.league[8].price
			};
		}
		return league;
	};
	setBotLog = async(message = 'update...', type = 'text', color = null) => {
		let log = this.state.botLog;
		if (message == 'clear') {
			log = (<Placeholder
				style={{overflow: "hidden"}}
				icon={<Icon28ListOutline width={56} height={56} />}
				stretched
			>
				Нет новых<br />действий
			</Placeholder>);
		} else {
			if (!Array.isArray(this.state.botLog)) log = [];
			if (type == 'text') {
				log.push({ type: 'text', message: message, color: color });
			} else log.push({ type: 'enemy', message: {
				avatar: `bot/arena/avatar_${message.avatar}.png`,
				title: message.name,
				time: this.props.options.getRealTime(),
				message: `Обнаружен противник с ${this.props.options.numberSpaces(message.hp*15)} HP и ${this.props.options.numberSpaces(message.dmg)} DMG`
			} });
		}
		this._isMounted && this.setState({ botLog: log }, () => this._isMounted && document.querySelector('.BotLog.Scroll')&&document.querySelector('.BotLog.Scroll').scrollTo({ top: document.querySelector('.BotLog.Scroll').scrollHeight }));
	};
	BotArena = async(mode = 'load') => {
		if (mode == 'start') {
			syncBot.isStart = true;
			this._isMounted && this.setState({ botLog: this.state.botLog });
		}
		const { botSettings } = this.state;
		const { setBotLog } = this;
		const { OpenModal, BotAPI, openSnackbar, numberForm, setActivePanel } = this.props.options;
		const { state } = this.props;
		const { getGame, server } = this.props.state;
		if (mode == 'pause') {
			syncBot.isStart = false;
			this._isMounted && setBotLog(`Бот поставлен на паузу, завершаем последнее действие`, 'text');
			this._isMounted && this.BotArena('reload');
			this._isMounted && this.setState({ isPause: false, isLoad: true });
			return;
		}

		
		let sslt = 0;
		let api_uid = state.login || state.user.vk.id;
		let auth_key = state.auth;
		if (!auth_key) {
			auth_key = this._isMounted && await BotAPI('getAuth', null, null, null, {stage: 'modal', text: 'Для продолжения работы необходимо указать ключ авторизации'});
			if (auth_key == 'modal') {
				this._isMounted && setActivePanel('profile');
				return;
			} else if (!auth_key) {
				this._isMounted && setActivePanel('profile');
				return;
			}
		}
		let getGameAuth = {
			login: api_uid,
			password: auth_key,
		};
		let dataProfile = this._isMounted && await getGame(this.props.state.server, {}, getGameAuth);
		getGameAuth.id = dataProfile?.u?._id || api_uid;
		// console.warn(dataProfile);
		if (!dataProfile?.u) {
			openSnackbar({text: 'Ключ авторизации игры неисправен, введите новый', icon: 'error'});
			this._isMounted && BotAPI('getAuth', null, null, null, {stage: 'modal', text: 'Ключ авторизации игры неисправен, введите новый', error: typeof dataProfile == 'string' ? dataProfile : dataProfile?.err_msg ? dataProfile?.err_msg : JSON.stringify(dataProfile)});
			this._isMounted && setActivePanel('profile');
			return;
		}
		let data = {
			player: null,
			try: 0
		};
		let dataArena = this._isMounted && await getGame(this.props.state.server, {
			i: 9,
			t: 1,
		}, getGameAuth);
		if (!dataArena || (dataArena && !dataArena.my_rating)) {
			this._isMounted && setActivePanel('profile');
			openSnackbar({text: 'Ошибка при получении данных арены', icon: 'error'});
			return;
		}
		data.player = {
			...dataProfile?.u,
			enemy: dataArena.u,
			rating: dataArena.my_rating
		}
		if (dataProfile?.chests?.ch) {
			typeof dataProfile?.chests?.ch?.length == 'undefined' ? dataProfile.chests.ch = [dataProfile?.chests?.ch] : [];
			data.player.chests = Number(dataProfile?.chests?.ch.length);
		}
		// console.log('Data', data);
		// console.log('Player', data.player);
		syncBot.arena = data;
		const startFight = async(auth_key, api_uid, sslt, id) => {
			let isAlive = true;
			let enemy = this._isMounted && await getGame(this.props.state.server, {
				i: 9,
				t: 1,
			}, getGameAuth);
			if (!enemy || (enemy && !enemy.my_rating)) {
				this._isMounted && syncBot.isStart && setBotLog(`Ошибка при получении данных врага`, 'text', 'red');
				this._isMounted && this.BotArena('pause');
				return;
			}
			syncBot.arena.player = {
				...syncBot.arena.player,
				enemy: enemy.u,
				rating: enemy.my_rating
			};
			enemy = enemy.u;
			this._isMounted && syncBot.isStart && setBotLog({ name: enemy._name == '' ? `Player${enemy._id}` : enemy._name, hp: Number(enemy._end) + Number(enemy._endi), dmg: Number(enemy._dmgi), avatar: Number(enemy._aid) }, 'newEnemy');
			
			let hp = (Number(enemy._end) + Number(enemy._endi)) * 15;
			let dmg = Number(enemy._dmgi);
			let myhp = (Number(data.player._end) + Number(data.player._endi)) * 15;
			let mydmg = Number(data.player._dmgi);
			let количествоУдаров = Math.ceil(hp/mydmg);
			let количествоУдаровНавыка = Math.floor((10+количествоУдаров)/9);
			let количествоУдаровВозможных = Math.ceil(myhp/dmg);
			// let количествоУдаровВозможных = Math.ceil(myhp/dmg)+количествоУдаровНавыка;
			if (!(количествоУдаров <= количествоУдаровВозможных) && botSettings.useEnergy) {
				isAlive = false;
				if (Number(syncBot.arena.player._en) >= 4) {
					syncBot.arena.player._en = this._isMounted && syncBot.arena.player._en - 4;
					this._isMounted && await getGame(this.props.state.server, {
						i: 121,
					}, getGameAuth);
					syncBot.arena.try++;
					this._isMounted && syncBot.isStart && setBotLog(`Успешно пропустили противника${botSettings.useLoss ? ` ${syncBot.arena.try}/${this.state.tryLimit}` : ''}`, 'text', 'green');
				} else {
					this._isMounted && syncBot.isStart && setBotLog(`Не хватает энергии на пропуск противника`, 'text', 'red');
					this._isMounted && this.BotArena('pause');
				}
				return false;
			}

			let fightPrice = Number(["0", "10", "30", "50", "90", "150", "250", "350", "500", "650"][syncBot.arena.player._al]);
			if (Number(syncBot.arena.player._m3) < fightPrice) {
				this._isMounted && syncBot.isStart && setBotLog(`Не хватает золота на создание противника`, 'text', 'red');
				this._isMounted && this.BotArena('pause');
				return false;
			}
			syncBot.arena.player._m3 = this._isMounted && Number(syncBot.arena.player._m3) - fightPrice;
			
			
			let fight = this._isMounted && await getGame(this.props.state.server, {
				i: 11,
				t: enemy._id,
			}, getGameAuth);
			if ((fight == null) || (fight && !fight.fight)) {
				await wait(3000);
				fight = this._isMounted && await getGame(this.props.state.server, {
					i: 11,
					t: enemy._id,
				}, getGameAuth);
			}


			

			const hit = async() => {
				fight._dmg = Number(enemy._dmgi);
				// console.warn('getFight', fight);
				let dmg = Number(fight._dmg);
				let mydmg = Number(data.player._dmgi);
				let навыкПротивника = Number(fight._esk);
				let hash;
				if (Number(fight._myr) >= 9 && Number(data.player._s3) > 0) {
					// console.log('INVISIBLE HIT');
					hash = this._isMounted && await BotAPI('getFightHash', null, null, null, {key: `<data><d 
						s0="0"
						s1="0"
						s2="0"
						s3="1"
						s4="0"
						c1="0"
						c2="0"
						c3="0"
						c4="0"
						c5="0"
						m0="3"
						r="1"
						dd="${mydmg+Number(data.player._s3)*7}"
						dg="0"
					/></data>`.replace(/\s+/g,' ')});
				} else {
					// console.log('SIMPLE HIT', навыкПротивника);
					if (навыкПротивника == 1) {
						hash = this._isMounted && await BotAPI('getFightHash', null, null, null, {key: `<data><d 
							s0="1"
							s1="0"
							s2="0"
							s3="0"
							s4="0"
							c1="0"
							c2="0"
							c3="0"
							c4="0"
							c5="0"
							m0="3"
							r="1"
							dd="${mydmg}"
							dg="${dmg+Number(enemy._s1)*5}"
						/></data>`.replace(/\s+/g,' ')});
					} else if (навыкПротивника == 2) {
						hash = this._isMounted && await BotAPI('getFightHash', null, null, null, {key: `<data><d 
							s0="1"
							s1="0"
							s2="0"
							s3="0"
							s4="0"
							c1="0"
							c2="0"
							c3="0"
							c4="0"
							c5="0"
							m0="3"
							r="1"
							dd="${mydmg-Number(enemy._s2)}"
							dg="${dmg}"
						/></data>`.replace(/\s+/g,' ')});
					} else if (навыкПротивника == 3) {
						hash = this._isMounted && await BotAPI('getFightHash', null, null, null, {key: `<data><d 
						s0="1"
						s1="0"
						s2="0"
						s3="0"
						s4="0"
						c1="0"
						c2="0"
						c3="0"
						c4="0"
						c5="0"
						m0="3"
						r="1"
						dd="0"
						dg="${dmg+Number(enemy._s3)*7}"
					/></data>`.replace(/\s+/g,' ')});
					} else {
						hash = this._isMounted && await BotAPI('getFightHash', null, null, null, {key: `<data><d 
							s0="1"
							s1="0"
							s2="0"
							s3="0"
							s4="0"
							c1="0"
							c2="0"
							c3="0"
							c4="0"
							c5="0"
							m0="3"
							r="1"
							dd="${mydmg}"
							dg="${dmg}"
						/></data>`.replace(/\s+/g,' ')});
					}
				}

				fight = this._isMounted && await getGame(this.props.state.server, {
					i: 12,
					t: hash,
				}, getGameAuth);
				if (fight && fight.fight) {
					let reward = Array.isArray(fight.r) ? fight.r[1] : fight.r;
					fight = fight.fight;
					if ((Number(fight._myhp) > 0 && Number(fight._hp) <= 0) || (Number(fight._myhp) <= 0 && Number(fight._hp) <= 0)) {
						// console.warn('endFight', fight);
						isAlive = false;
						// console.warn(syncBot.arena.player._ap, syncBot.arena.player._ap, reward._ap);
						if (Array.isArray(fight.r)) syncBot.arena.player.chests++;
						syncBot.arena.player._ap = Number(syncBot.arena.player._ap) + 19;
						syncBot.arena.player._exp = Number(syncBot.arena.player._exp) + (Number.isInteger(Number(reward._exp)) ? Number(reward._exp) : 0);
						let league = this.getLeague(syncBot.arena.player._ap);
						syncBot.arena.player._al = league.id;
						this._isMounted && syncBot.isStart && setBotLog(`Успешно убили противника`, 'text', 'green');
						return true;
					} else if (Number(fight._myhp) <= 0) {
						// console.warn('endFight', fight);
						isAlive = false;
						// console.warn(syncBot.arena.player._ap, syncBot.arena.player._ap);
						syncBot.arena.player._ap = Number(syncBot.arena.player._ap) - 16;
						let league = this.getLeague(syncBot.arena.player._ap);
						syncBot.arena.player._al = league.id;
						syncBot.arena.try++;
						this._isMounted && syncBot.isStart && setBotLog(`Противник оказался сильнее${botSettings.useLoss ? ` ${syncBot.arena.try}/${this.state.tryLimit}` : ''}`, 'text', 'red');
						return true;
					} else {
						isAlive = true;
						// console.warn('isAlive', isAlive);
						// this._isMounted && setBotLog(`Успешно ударили противника`, 'text');
						return true;
					}
				} else {
					isAlive = false;
					// console.warn('isAlive', isAlive);
					this._isMounted && syncBot.isStart && setBotLog(`Ошибка при убийстве противника`, 'text', 'red');
					this._isMounted && this.BotArena('pause');
					return false;
				}
			}

			if (fight && fight.fight) {
				do {
					this._isMounted && await hit();
				} while (this._isMounted && isAlive);
			} else {
				this._isMounted && setBotLog(`Невозможно создать противника`, 'text', 'red');
				this._isMounted && this.BotArena('pause');
				return false;
			}
		};
		if (mode == 'start') {
			syncBot.isStart = true;
			this._isMounted && setBotLog(`Бот успешно запущен`, 'text', 'green');
			if (botSettings.useChest && syncBot.arena.player.chests == 3) {
				this._isMounted && setBotLog(`Лимит сундуков`, 'text', 'red');
				this._isMounted && this.BotArena('pause');
				return false;
			}
			do {
				this._isMounted && await startFight(auth_key, api_uid, sslt, Number(data.player._id));
			} while (this._isMounted && syncBot.isStart && ((botSettings.useLoss && syncBot.arena.try < this.state.tryLimit) || (botSettings.useChest && syncBot.arena.player.chests < 3)));
			this._isMounted && syncBot.isStart && this.BotArena('pause');
		}
		if (mode == 'load' || mode == 'reload') {
			if (mode == 'load') {
				let settings = this._isMounted && await this.props.options.Storage({key: 'arenaSettings', defaultValue: JSON.stringify(botSettings)});
				if (settings) {
					settings = JSON.parse(settings.value);
					if (settings) {
						botSettings.useEnergy = settings.useEnergy;
						botSettings.useGold = settings.useGold;
						botSettings.useLoss = settings.useLoss;
						botSettings.useChest = settings.useChest;
						this.state.tryLimit = settings.tryLimit || 20;
					}
				}
			}
			if (mode == 'reload') {
				this._isMounted && setBotLog(`Данные обновлены`, 'text');
			}
			this._isMounted && this.setState({ isLoad: false });
		}
	};
	async componentDidMount() {
		console.log('[PANEL] >', this.props.id);
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
		this._isMounted = true;
		syncBot.arena = null;
		await this.BotArena('load');
	};
	async componentDidUpdate() {
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
	};
	async componentWillUnmount () {
		this._isMounted = false;
		syncBot.isStart = false;
		syncBot.arena = null;
	};
	async shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.state.snackbar!=this.state.snackbar&&nextState.snackbar==this.state.snackbar) this.setState({ snackbar: nextProps.state.snackbar });
		if (nextState.snackbar!=this.state.snackbar) return true;
		return false;
	}
	render() {
		const { state, options, parent } = this.props;
		const { botSettings } = this.state;
		const { BotArena } = this;
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord-helper/media/images/';
		const title = 'Арена';
		const description = 'Мой профиль';
		const avatar = 'labels/30.png';
		return (
			<Panel id={this.props.id}>
				{!state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
				<Group>
					{state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
					{syncBot.arena?<React.Fragment>
						<div className="Scroll" style={{maxHeight: state.isDesktop ? '299px' : 'unset'}}>
							{!this.state.isLoad?<CardGrid size={state.isDesktop ? "s" : "m"}>
								<Card className='DescriptionCardWiki'>
									<SimpleCell
										before={<Avatar size={32} mode="app" src={`${pathImages}bot/arena/2.png`} />}
										description={options.numberSpaces(syncBot.arena.player.chests)}
									>
										Сундуки
									</SimpleCell>
								</Card>
								<Card className='DescriptionCardWiki'>
									<SimpleCell
										before={<Avatar size={32} mode="app" src={`${pathImages}bot/arena/19.png`} />}
										description={options.numberSpaces(syncBot.arena.player._en)}
									>
										Энергия
									</SimpleCell>
								</Card>
								<Card className='DescriptionCardWiki'>
									<SimpleCell
										before={<Avatar size={32} mode="app" src={`${pathImages}bot/arena/11.png`} />}
										description={options.numberSpaces(syncBot.arena.player._m3)}
									>
										Золото
									</SimpleCell>
								</Card>
								<Card className='DescriptionCardWiki'>
									<SimpleCell
										before={<Avatar size={32} mode="app" src={`${pathImages}bot/arena/${["46", "37", "38", "39", "40", "41", "42", "43", "44", "45"][syncBot.arena.player._al]}.png`} />}
										description={["Нет лиги", "Лига Новичков", "Лига Воинов I", "Лига Воинов II", "Лига Мастеров", "Лига Рыцарей", "Лига Чемпионов", "Тёмная Лига", "Кровавая Лига", "Легендарная Лига"][syncBot.arena.player._al]}
									>
										Лига
									</SimpleCell>
								</Card>
								<Card className='DescriptionCardWiki'>
									<SimpleCell
										before={<Avatar size={32} mode="app" src={`${pathImages}bot/arena/8.png`} />}
										description={options.numberSpaces(syncBot.arena.player.rating._val)}
									>
										Место в лиге
									</SimpleCell>
								</Card>
								<Card className='DescriptionCardWiki'>
									<SimpleCell
										before={<Avatar size={32} mode="app" src={`${pathImages}bot/arena/1.png`} />}
										description={options.numberSpaces(syncBot.arena.player._ap)}
									>
										Кубки арены
									</SimpleCell>
								</Card>
							</CardGrid>:<CardGrid size={state.isDesktop ? "s" : "m"}>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
							</CardGrid>}
							<Spacing separator size={16} />
							<CardGrid size="l" onChange={(e) => this._isMounted && this.updateSelect(e)}>
								<Card className='DescriptionCardWiki Clear forSlider'>
									<Slider
										disabled={syncBot.isStart}
										step={1}
										min={1}
										max={100}
										value={Number(this.state.tryLimit)}
										onChange={tryLimit => this.setState({tryLimit})}
									/>
									<Radio className="Clear" disabled={syncBot.isStart}>Лимит проигрышей</Radio>
								</Card>
							</CardGrid>
							<Spacing size={8} />
							<CardGrid size="m">
								<Card className='DescriptionCardWiki Clear withRadio'>
									<Radio checked={this.state.botSettings.useLoss} onChange={(e) => this._isMounted && this.updateSelect(e)} name="endMode" disabled={syncBot.isStart} value="1" description={`Остановка после ${this.state.tryLimit} ${options.numberForm(this.state.tryLimit, ['боя', 'боёв', 'боёв'])}`}>Бой</Radio>
								</Card>
								<Card className='DescriptionCardWiki Clear withRadio'>
									<Radio checked={this.state.botSettings.useChest} onChange={(e) => this._isMounted && this.updateSelect(e)} name="endMode" disabled={syncBot.isStart || Number(syncBot.arena.player.chests) == 3} value="2" description="Остановка после лимита сундуков">Сундуки</Radio>
								</Card>
								<Card className='DescriptionCardWiki Clear'>
									<Radio checked={this.state.botSettings.useEnergy} onChange={(e) => this._isMounted && this.updateSelect(e)} name="skipMode" disabled={syncBot.isStart} value="1" description="Тратит 4 энергии">Энергия</Radio>
								</Card>
								<Card className='DescriptionCardWiki Clear'>
									<Radio checked={this.state.botSettings.useGold} onChange={(e) => this._isMounted && this.updateSelect(e)} name="skipMode" disabled={syncBot.isStart} value="2" description={`Тратит ${["0", "10", "30", "50", "90", "150", "250", "350", "500", "650"][syncBot.arena.player._al]} золота и 16 кубков`}>Золото</Radio>
								</Card>
							</CardGrid>
						</div>
						<div className='Sticky Sticky__bottom withSeparator'>
							<Spacing size={8} />
							<div className="BotLog Scroll" style={{marginLeft: 8, marginRight: state.isDesktop?0:8}}>{!Array.isArray(this.state.botLog)?this.state.botLog:this.state.botLog.map((item, x) => {
								if (item.type == 'text') return (<span key={x} className={item.color}>{item.message}</span>)
								if (item.type == 'newEnemy' || item.type == 'enemy') return (<div key={x} className="Log__message">
									<Avatar size={36} mode="app" src={`${pathImages}${item.message.avatar}`} />
									<div className="Log__message--main">
										<div className="Log__message--title">
											<span>{item.message.title}</span>
											<span>{item.message.time}</span>
										</div>
										<div className="Log__message--children">{item.message.message}</div>
									</div>
								</div>)
							})}</div>
							<Spacing separator size={16} style={{padding: 0, marginRight: state.isDesktop&&'-7px', marginLeft: state.isDesktop&&'-7px'}}/>
							<div style={{
								display: 'flex',
								marginRight: state.isDesktop ? 0 : 8,
								marginLeft: state.isDesktop ? 0 : 8
							}}>
								<Button size="m" mode="tertiary" onClick={() => this._isMounted && this.setBotLog('clear')} stretched>Отчистить лог действий</Button>
							</div>
							<Spacing size={8} />
							{state.isDesktop?<div style={{
								display: 'flex',
								marginRight: 0,
								marginLeft: 0
							}}>
								<Button size="m" onClick={() => this._isMounted && BotArena('start')} disabled={syncBot.isStart||this.state.isLoad} loading={syncBot.isStart} stretched mode="commerce" style={{ marginRight: 8 }}>Запустить</Button>
								<Button size="m" onClick={() => this._isMounted && this.setState({ isPause: true }, () => BotArena('pause'))} disabled={!syncBot.isStart||this.state.isLoad} loading={this.state.isPause} stretched mode="destructive" style={{ marginRight: 8 }}>Остановить</Button>
								<Button size="m" onClick={() => this._isMounted && this.setState({ isLoad: true }, () => BotArena('reload'))} disabled={syncBot.isStart||this.state.isLoad} loading={this.state.isLoad} stretched mode="secondary">Обновить</Button>
							</div>:<div style={{
								display: 'flex',
								marginRight: 8,
								marginLeft: 8
							}}>
								<Button size="m" onClick={() => this._isMounted && BotArena('start')} disabled={syncBot.isStart||this.state.isLoad} loading={syncBot.isStart} stretched mode="commerce" style={{ marginRight: 8 }}>Запустить</Button>
								<Button size="m" onClick={() => this._isMounted && this.setState({ isPause: true }, () => BotArena('pause'))} disabled={!syncBot.isStart||this.state.isLoad} loading={this.state.isPause} stretched mode="destructive" style={{ marginRight: 8 }}>Остановить</Button>
								<Button size="m" onClick={() => this._isMounted && this.setState({ isLoad: true }, () => BotArena('reload'))} disabled={syncBot.isStart||this.state.isLoad} loading={this.state.isLoad} stretched mode="secondary">Обновить</Button>
							</div>}
						</div>
					</React.Fragment>:<React.Fragment>
					<div className="Scroll" style={{maxHeight: state.isDesktop ? '299px' : 'unset', overflow: 'hidden'}}>
							<CardGrid size={state.isDesktop ? "s" : "m"}>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
								<Card className='DescriptionCardWiki withSkeleton'>
									<Skeleton height={32} width={32}/>
									<Skeleton height={state.isDesktop?38:38} width={108} />
								</Card>
							</CardGrid>
							<Spacing separator size={16} />
							<CardGrid size={state.isDesktop ? "m" : "m"}>
								<Card className='DescriptionCardWiki Clear'>
									<Skeleton height={state.isDesktop?36:52}/>
								</Card>
								<Card className='DescriptionCardWiki Clear'>
									<Skeleton height={state.isDesktop?36:52}/>
								</Card>
								<Card className='DescriptionCardWiki Clear'>
									<Skeleton height={36}/>
								</Card>
								<Card className='DescriptionCardWiki Clear'>
									<Skeleton height={36}/>
								</Card>
								<Card className='DescriptionCardWiki Clear'>
									<Skeleton height={36}/>
								</Card>
								<Card className='DescriptionCardWiki Clear'>
									<Skeleton height={36}/>
								</Card>
							</CardGrid>
						</div>
						<div className='Sticky Sticky__bottom withSeparator'>
							<Spacing size={8} />
							<div className="BotLog Scroll" style={{marginLeft: 8, marginRight: state.isDesktop?0:8, overflow: 'hidden'}}>
								<Skeleton height={20} width={144} flexShrink={0}/>
								<div className="Log__message">
									<Skeleton height={36} width={36} marginRight={12} flexShrink={0}/>
									<Skeleton height={36} width={234} flexShrink={0}/>
								</div>
								<Skeleton height={20} width={220} flexShrink={0}/>
								<Skeleton height={20} width={320} flexShrink={0}/>
								<div className="Log__message">
									<Skeleton height={36} width={36} marginRight={12} flexShrink={0}/>
									<Skeleton height={36} width={184} flexShrink={0}/>
								</div>
								<Skeleton height={20} width={100} flexShrink={0}/>
							</div>
							<Spacing separator size={16} style={{padding: 0, marginRight: state.isDesktop&&'-7px', marginLeft: state.isDesktop&&'-7px'}}/>
							<div style={{
								display: 'flex',
								marginRight: state.isDesktop ? 0 : 8,
								marginLeft: state.isDesktop ? 0 : 8
							}}>
								<Skeleton height={state.isDesktop?32:36}/>
							</div>
							<Spacing size={8} />
							{state.isDesktop?<div style={{
								display: 'flex',
								marginRight: 0,
								marginLeft: 0
							}}>
								<Skeleton height={32} width="100%" marginRight={8}/>
								<Skeleton height={32} width="100%" marginRight={8}/>
								<Skeleton height={32} width="100%"/>
							</div>:<div style={{
								display: 'flex',
								marginRight: 8,
								marginLeft: 8
							}}>
								<Skeleton height={36} width="100%" marginRight={8}/>
								<Skeleton height={36} width="100%" marginRight={8}/>
								<Skeleton height={36} width="100%"/>
							</div>}
					</div>
					</React.Fragment>}
				</Group>
				{this.state.snackbar}
			</Panel>
		);
	};
};
export default PANEL;