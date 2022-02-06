import React from 'react';
import {
	Spacing,
	Panel,
	Group,
	Button,
	Avatar
} from '@vkontakte/vkui';
import { Icon28ChevronLeftOutline, Icon28Chevrons2LeftOutline } from '@vkontakte/icons';
import Skeleton from '../../components/skeleton';
import TableCell from '../../components/tableCell';

const ratingTabs = [{
	id: 'dmg',
	name: 'Атака'
}, {
	id: 'hp',
	name: 'Здоровье'
}, {
	id: 'cups',
	name: 'Кубки'
}, {
	id: 'skills',
	name: 'Навыки'
}];

class PANEL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: null,
			ratingPage: 0,
			rating: null
		};
		this._isMounted = false;
	};
	loadRating = async() => {
		const { getData } = this.props.state;
		let rating = null;
		let count = 0;
		let getTime = () => new Date(+new Date - count * 86400000).toLocaleString("ru", {
			timezone: 'UTC',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		}).replace(/(\d*).(\d*).(\d*)/g, '$3.$2.$1');
		do {
			let time = this._isMounted && getTime();
			let dataRating = this._isMounted && await getData(`https://dobriy-vecher-vlad.github.io/warlord-admin/data/users/${time}.json`);
			if (dataRating) rating = {
				users: dataRating.sort((a, b) => {
					if (Array.isArray(b[this.props.state.ratingMode]) && Array.isArray(a[this.props.state.ratingMode])) {
						return b[this.props.state.ratingMode].reduce((first, second) => first + second) - a[this.props.state.ratingMode].reduce((first, second) => first + second)
					} else {
						return b[this.props.state.ratingMode] - a[this.props.state.ratingMode]
					}
				}),
				time: time
			};
			count++;
		} while (rating == null && this._isMounted);
		this._isMounted && this.setState({rating});
	};
	async componentDidMount() {
		console.log('[PANEL] >', this.props.id, this.props.state.ratingMode);
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
		this._isMounted = true;
		this._isMounted && await this.loadRating();
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
	}
	render() {
		const { state, options, parent } = this.props;
		const { ratingPage } = this.state;
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord-helper/media/images/';
		const ratingTab = ratingTabs.find(rating => rating.id == this.props.state.ratingMode);
		const title = ratingTab?ratingTab.name:'Уровень';
		const description = 'Рейтинг';
		const avatar = 'labels/23.png';
		const grid = state.isDesktop ? {display: 'grid', alignItems: 'center', gridTemplateColumns: '40px 32px auto auto', gridGap: '8px'} : {display: 'grid', alignItems: 'center', gridTemplateColumns: '40px 32px auto auto', gridGap: '16px'};
		const count = 50;
		return (
			<Panel id={this.props.id}>
				{!state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
				<Group>
					{this.state?.rating?<React.Fragment>
						<div className='Sticky Sticky__top withSeparator'>
							{state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
							<div className="TableCell HorizontalRating">
								<div className="TableCell__content" style={grid}>
									<div
										style={{color: 'var(--text_secondary)'}}
										className="TableCell__row"
									><span>#</span></div>
									<div style={{height: 32}}/>
									<div
										style={{color: 'var(--text_secondary)'}}
										className="TableCell__row"
									><span>имя</span></div>
									<div
										style={{color: 'var(--text_secondary)'}}
										className="TableCell__row"
									><span>{ratingTab?ratingTab.name.toLowerCase():'уровень'}</span></div>
								</div>
							</div>
							<Spacing size={8} />
						</div>
						<div className="Scroll HorizontalRating" style={{maxHeight: state.isDesktop ? '392px' : 'unset', minHeight: state.isDesktop ? 'unset' : 'unset'}}>
							{this.state.rating.users.slice(ratingPage*count, (ratingPage+1)*count).map((user, x) => <TableCell
								key={x}
								count={options.numberSpaces(ratingPage*count+x+1, ' ')}
								href={`https://vk.com/id${user.vkId}`}
								avatar={<Avatar size={32} src={`${pathImages}bot/arena/avatar_${user.avatar}.png`} />}
								style={grid}
								rows={[{
									title: user.name?user.name:`Player\n${user.id}`
								}, {
									title: options.numberSpaces(Array.isArray(user[ratingTab?ratingTab.id:'lvl'])?user[ratingTab?ratingTab.id:'lvl'].reduce((first, second) => first + second):user[ratingTab?ratingTab.id:'lvl']*(ratingTab?.id=='hp'?15:1), ' ')
								}]}
							/>)}
						</div>
						<div className='Sticky Sticky__bottom withSeparator'>
							<Spacing size={10} />
							{this?.props?.state?.user?.vk?.id?this.state.rating.users.find(user => user.vkId == this.props.state.user.vk.id)?<div className="HorizontalRating">
								{[this.state.rating.users.find(user => user.vkId == this.props.state.user.vk.id)].map((user, x) => <TableCell
									key={x}
									count={options.numberSpaces(this.state.rating.users.findIndex(user => user.vkId == this.props.state.user.vk.id)+1, ' ')}
									href={`https://vk.com/id${user.vkId}`}
									style={grid}
									avatar={<Avatar size={32} src={`${pathImages}bot/arena/avatar_${user.avatar}.png`} />}
									rows={[{
										title: user.name?user.name:`Player\n${user.id}`
									}, {
										title: options.numberSpaces(Array.isArray(user[ratingTab?ratingTab.id:'lvl'])?user[ratingTab?ratingTab.id:'lvl'].reduce((first, second) => first + second):user[ratingTab?ratingTab.id:'lvl']*(ratingTab?.id=='hp'?15:1), ' ')
									}]}
								/>)}
							</div>:<div className="HorizontalRating" style={{height: 32, color: 'var(--text_secondary)', fontSize: '13px', lineHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: !state.isDesktop&&'75%', textAlign: 'center', margin: 'auto'}}>Авторизуйте профиль на сервере Эрмун и обновите приложение</div>:<div className="HorizontalRating" style={{height: 32, color: 'var(--text_secondary)', fontSize: '13px', lineHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: !state.isDesktop&&'75%', textAlign: 'center', margin: 'auto'}}>Авторизуйтесь для отображения вашего положения в рейтинге</div>}
							<Spacing size={16} separator />
							<div className="TableCell">
								<div className="TableCell__content">
									<div className="TableCell__row" style={{overflow: 'hidden'}}>
										<span style={{color: 'var(--text_secondary)'}}>Показана {options.numberSpaces(ratingPage+1, ' ')} страница из {options.numberSpaces(Math.ceil(this.state.rating.users.length/count), ' ')}</span>
										<span style={{display: 'flex', width: !state.isDesktop&&'100%', justifyContent: 'flex-end'}}>
											<Button mode="tertiary" className="ButtonIcon" onClick={() => this.setState({ ratingPage: 0 })} disabled={ratingPage<=0}><Icon28Chevrons2LeftOutline/></Button>
											<Button mode="tertiary" className="ButtonIcon" onClick={() => this.setState({ ratingPage: ratingPage-1 })} disabled={ratingPage<=0}><Icon28ChevronLeftOutline/></Button>
											<Button mode="tertiary" className="ButtonIcon" onClick={() => this.setState({ ratingPage: ratingPage+1 })} disabled={ratingPage>=Math.ceil(this.state.rating.users.length/count)-1}><Icon28ChevronLeftOutline style={{transform: 'rotate(180deg)'}}/></Button>
											<Button mode="tertiary" className="ButtonIcon" onClick={() => this.setState({ ratingPage: Math.ceil(this.state.rating.users.length/count)-1 })} disabled={ratingPage>=Math.ceil(this.state.rating.users.length/count)-1}><Icon28Chevrons2LeftOutline style={{transform: 'rotate(180deg)'}}/></Button>
										</span>
									</div>
								</div>
							</div>
							<Spacing size={2} />
						</div>
					</React.Fragment>:<React.Fragment>
						<div className='Sticky Sticky__top withSeparator'>
							{state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
							<div className="TableCell">
								<div className="TableCell__content" style={grid}>
									<div/>
									<div style={{height: 32}}/>
									<div/>
									<Skeleton height={16}/>
								</div>
							</div>
							<Spacing size={8} />
						</div>
						<div className="Scroll" style={{maxHeight: state.isDesktop ? '392px' : 'unset', minHeight: state.isDesktop ? 'unset' : 'calc(100vh - 216px)'}}>
							{new Array(state.isDesktop?10:50).fill(null).map((item, x) => <div key={x} className="TableCell">
								<div className="TableCell__content" style={grid}>
									<Skeleton height={16}/>
									<Skeleton height={32} borderRadius="50%"/>
									<Skeleton height={16}/>
									<Skeleton height={16}/>
								</div>
							</div>)}
						</div>
						<div className='Sticky Sticky__bottom withSeparator'>
							<Spacing size={10} />
							<div className="HorizontalRating">
								<div className="TableCell">
									<div className="TableCell__content" style={grid}>
										<Skeleton height={16}/>
										<Skeleton height={32} borderRadius="50%"/>
										<Skeleton height={16}/>
										<Skeleton height={16}/>
									</div>
								</div>
							</div>
							<Spacing size={16} separator />
							<div className="TableCell">
								<div className="TableCell__content">
									<div className="TableCell__row">
										<Skeleton height={16} width="35%"/>
										<Skeleton height={30} width="20%"/>
									</div>
								</div>
							</div>
							<Spacing size={2} />
						</div>
					</React.Fragment>}
				</Group>
				{this.state.snackbar}
			</Panel>
		);
	};
};
export default PANEL;