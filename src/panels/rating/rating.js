import React from 'react';
import {
	Spacing,
	Panel,
	Group,
	HorizontalScroll,
	Header,
	Link,
	Footer,
	HorizontalCell,
	Avatar,
	Counter,
	PanelHeader
} from '@vkontakte/vkui';

import Skeleton from '../../components/skeleton';
import TableCell from '../../components/tableCell';
import { Icon12ChevronOutline } from '@vkontakte/icons';

let ratingTabs = [{
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
				users: dataRating,
				time: time
			};
			count++;
		} while (rating == null && this._isMounted);
		this._isMounted && this.setState({rating});
	};
	async componentDidMount() {
		console.log('[PANEL] >', this.props.id, this.props.state.ratingMode);
		this._isMounted = true;
		this._isMounted && await this.loadRating();
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
		const { setState, state, options, parent } = this.props;
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord-helper/media/images/';
		const title = 'Рейтинг';
		const grid = state.isDesktop ? {display: 'grid', alignItems: 'center', gridTemplateColumns: '40px 32px auto auto', gridGap: '8px'} : {display: 'grid', alignItems: 'center', gridTemplateColumns: '40px 32px auto auto', gridGap: '16px'};
		return (
			<Panel id={this.props.id}>
				{!state.isDesktop && <PanelHeader>Рейтинг</PanelHeader>}
				<Group>
					{state.isDesktop && <PanelHeader className='HeaderFix' fixed={false} separator={true} right={options.getCopy(parent)}>{title}</PanelHeader>}
					<div className="HorizontalRating">
						{this.state?.rating?<React.Fragment>
							<Header mode="primary" aside={<Link onClick={() => setState({ ratingMode: 'lvl' }, options.setActivePanel('1'))}>
								Показать все <Icon12ChevronOutline />
							</Link>}>Общий рейтинг</Header>
							<HorizontalScroll getScrollToLeft={(i) => i - 88 * 3} getScrollToRight={(i) => i + 88 * 3}>
								<div>
									{this.state.rating.users.sort((a, b) => b.exp - a.exp).slice(0, state.isDesktop?5:10).map((user, x) => <HorizontalCell key={x} size="s" href={`https://vk.com/id${user.vkId}`} target="_blank" header={user.name?user.name:`Player\n${user.id}`} subtitle={`${user.lvl} уровень`}>
										<Avatar size={72} src={`${pathImages}bot/arena/avatar_${user.avatar}.png`} badge={<Counter size="m">{x+1}</Counter>} />
									</HorizontalCell>)}
								</div>
							</HorizontalScroll>
						</React.Fragment>:<React.Fragment>
							<Header mode="primary" aside={<Skeleton height={20} width={100}/>}><Skeleton height={22} width={100}/></Header>
							<HorizontalScroll>
								<div>
									{new Array(5).fill(null).map((user, x) => <HorizontalCell key={x} size="s" header={<Skeleton height={16}/>} subtitle={<Skeleton height={14} width={'75%'} margin={'auto'} marginTop={4}/>}>
										<Skeleton height={72} width={72} minWidth={72} borderRadius="50%"/>
									</HorizontalCell>)}
								</div>
							</HorizontalScroll>
						</React.Fragment>}
					</div>
					{state.isDesktop?<Spacing size={8} />:<Spacing size={8} separator/>}
					<div className="HorizontalRatings">
						<div className="HorizontalRatings-wrap">
							{ratingTabs.map((rating, x) => <div key={x} className="HorizontalRating">
								{this.state?.rating?<React.Fragment>
									<Header mode="primary" aside={<Link onClick={() => setState({ ratingMode: rating.id }, options.setActivePanel('1'))}>Показать все <Icon12ChevronOutline /></Link>}>{rating.name}</Header>
									<div>
										{this.state.rating.users.sort((a, b) => {
											if (Array.isArray(b[rating.id]) && Array.isArray(a[rating.id])) {
												return b[rating.id].reduce((first, second) => first + second) - a[rating.id].reduce((first, second) => first + second)
											} else {
												return b[rating.id] - a[rating.id]
											}
										}).slice(0, 3).map((user, x) => <TableCell
											key={x}
											count={options.numberSpaces(x+1, ' ')}
											href={`https://vk.com/id${user.vkId}`}
											style={grid}
											avatar={<Avatar size={32} src={`${pathImages}bot/arena/avatar_${user.avatar}.png`} />}
											rows={[{
												title: user.name?user.name:`Player\n${user.id}`
											}, {
												title: options.numberSpaces(Array.isArray(user[rating.id])?user[rating.id].reduce((first, second) => first + second):user[rating.id]*(rating?.id=='hp'?15:1), ' ')
											}]}
										/>)}
										<Spacing size={16} separator />
										{[this?.props?.state?.user?.vk?.id&&this.state.rating.users.find(user => user.vkId == this.props.state.user.vk.id)?this.state.rating.users.find(user => user.vkId == 153968505):this.state.rating.users[this.state.rating.users.length-1]].map((user, x) => <TableCell
											key={x}
											count={options.numberSpaces(this.state.rating.users.findIndex(userF => userF.vkId == user.vkId)+1, ' ')}
											href={`https://vk.com/id${user.vkId}`}
											style={grid}
											avatar={<Avatar size={32} src={`${pathImages}bot/arena/avatar_${user.avatar}.png`} />}
											rows={[{
												title: user.name?user.name:`Player\n${user.id}`
											}, {
												title: options.numberSpaces(Array.isArray(user[rating.id])?user[rating.id].reduce((first, second) => first + second):user[rating.id]*(rating?.id=='hp'?15:1), ' ')
											}]}
										/>)}
									</div>
								</React.Fragment>:<React.Fragment>
									<Header mode="primary" aside={<Skeleton height={20} width={100}/>}><Skeleton height={22} width={100}/></Header>
									<div>
										{new Array(3).fill(null).map((user, x) => <div key={x} className="TableCell">
											<div className="TableCell__content" style={grid}>
												<Skeleton height={16}/>
												<Skeleton height={32} borderRadius="50%"/>
												<Skeleton height={16}/>
												<Skeleton height={16}/>
											</div>
										</div>)}
										<Spacing size={16} separator />
										<div className="TableCell">
											<div className="TableCell__content" style={grid}>
												<Skeleton height={16}/>
												<Skeleton height={32} borderRadius="50%"/>
												<Skeleton height={16}/>
												<Skeleton height={16}/>
											</div>
										</div>
									</div>
								</React.Fragment>}
							</div>)}
						</div>
					</div>
					<Spacing size={8} />
					{this.state?.rating?<Footer style={{margin: 0}}>Эрмун, обновлено {this.state.rating.time.replace(/(\d*).(\d*).(\d*)/g, '$3.$2.$1')}, {options.numberSpaces(this.state.rating.users.length, ' ')} игроков</Footer>:<Footer style={{margin: 0}}><Skeleton height={16} width={'35%'} margin={'auto'}/></Footer>}
				</Group>
				{this.state.snackbar}
			</Panel>
		);
	};
};
export default PANEL;