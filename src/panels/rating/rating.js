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

const usersTop = [{
	"id": 153968505,
	"vkId": 153968505,
	"exp": 78274462,
	"lvl": 61,
	"name": "xolova",
	"avatar": 8,
	"room": 1,
	"date": [
		174248228,
		5499,
		24177548
	],
	"hp": 31734,
	"dmg": 69172,
	"guild": 2000,
	"premium": false,
	"location": 16,
	"pet": 4,
	"skills": [
		1,
		5,
		153,
		170
	],
	"league": 2,
	"cups": 701
}, {
	"id": 978313,
	"vkId": 978313,
	"exp": 1521269602,
	"lvl": 78,
	"name": "ВС набор от 80к",
	"avatar": 27,
	"room": 1,
	"date": [
		168395395,
		488,
		165076356
	],
	"hp": 65217,
	"dmg": 242079,
	"guild": 108,
	"premium": true,
	"location": 16,
	"pet": 2,
	"skills": [
		524,
		500,
		928,
		291
	],
	"league": 2,
	"cups": 352
}, {
	"id": 12565430,
	"vkId": 12565430,
	"exp": 924287567,
	"lvl": 75,
	"name": "[BC] Татьяна",
	"avatar": 2,
	"room": 5,
	"date": [
		161632208,
		23,
		165076367
	],
	"hp": 59232,
	"dmg": 212670,
	"guild": 108,
	"premium": false,
	"location": 33,
	"pet": 3,
	"skills": [
		250,
		250,
		566,
		217
	],
	"league": 2,
	"cups": 257
}, {
	"id": 390791769,
	"vkId": 390791769,
	"exp": 705929112,
	"lvl": 73,
	"name": "  ВС Димон",
	"avatar": 2,
	"room": 5,
	"date": [
		166627217,
		56430,
		104281578
	],
	"hp": 55676,
	"dmg": 198718,
	"guild": 108,
	"premium": false,
	"location": 25,
	"pet": 5,
	"skills": [
		100,
		101,
		394,
		215
	],
	"league": 2,
	"cups": 200
}, {
	"id": 216833884,
	"vkId": 216833884,
	"exp": 899497002,
	"lvl": 75,
	"name": "[-] ВС [-] Елена",
	"avatar": 13,
	"room": 5,
	"date": [
		164660257,
		23777,
		165076531
	],
	"hp": 61669,
	"dmg": 192064,
	"guild": 108,
	"premium": true,
	"location": 21,
	"pet": 5,
	"skills": [
		54,
		50,
		562,
		235
	],
	"league": 2,
	"cups": 238
}];
let usersTopID = [{
	id: 'dmg',
	name: 'Атака',
	date: '04.02.2022'
}, {
	id: 'hp',
	name: 'Здоровье',
	date: '02.02.2022'
}, {
	id: 'cups',
	name: 'Кубки',
	date: '03.02.2022'
}, {
	id: 'skills',
	name: 'Навыки',
	date: '01.02.2022'
}];

class PANEL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: null
		};
	};
	async componentDidMount() {
		console.log('[PANEL] >', this.props.id);
	};
	async shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.state.snackbar!=this.state.snackbar&&nextState.snackbar==this.state.snackbar) this.setState({ snackbar: nextProps.state.snackbar });
		if (nextState.snackbar!=this.state.snackbar) return true;
		return false;
	}
	render() {
		const { state, options, parent } = this.props;
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord-helper/media/images/';
		const title = 'Рейтинг';
		return (
			<Panel id={this.props.id}>
				{!state.isDesktop && <PanelHeader>Рейтинг</PanelHeader>}
				<Group>
					{state.isDesktop && <PanelHeader className='HeaderFix' fixed={false} separator={true} right={options.getCopy(parent)}>{title}</PanelHeader>}
					<div className="HorizontalRating">
						<Header mode="primary" aside={<Link onClick={() => options.setActivePanel('1')}>
							Показать все <Icon12ChevronOutline />
						</Link>}>Общий рейтинг</Header>
						<HorizontalScroll>
							<div>
								{usersTop.map((user, x) => <HorizontalCell key={x} size="s" header={user.name} subtitle={`${user.lvl} уровень`}>
									<Avatar size={72} src={`${pathImages}bot/arena/avatar_${user.avatar}.png`} badge={<Counter size="m">{x+1}</Counter>} />
								</HorizontalCell>)}
							</div>
						</HorizontalScroll>
					</div>
					<Spacing size={8} />
					<div className="HorizontalRatings">
						<div className="HorizontalRatings-wrap">
							{usersTopID.map((rating, x) => <div key={x} className="HorizontalRating">
								<Header mode="primary" aside={<Link onClick={() => options.setActivePanel('1')}>
									Показать все <Icon12ChevronOutline />
								</Link>}>{rating.name}</Header>
								<div>
									{usersTop.sort((a, b) => b[rating.id] - a[rating.id]).slice(0, 3).map((user, x) => <TableCell
										key={x}
										count={options.numberSpaces(x+1, ' ')}
										href={`https://vk.com/id${user.vkId}`}
										style={state.isDesktop ? {display: 'grid', alignItems: 'center', gridTemplateColumns: '22px 32px auto auto', gridGap: '8px'} : {display: 'grid', alignItems: 'center', gridTemplateColumns: '32px 32px 20% repeat(3, calc(80% / 3 - (32px + 32px) / 3))', width: 'calc(100% - 16px * 5)', gridGap: '16px'}}
										avatar={<Avatar size={32} src={`${pathImages}bot/arena/avatar_${user.avatar}.png`} />}
										rows={[{
											title: user.name
										}, {
											title: options.numberSpaces(Array.isArray(user[rating.id])?user[rating.id].reduce((first, second) => first + second):user[rating.id], ' ')
										}]}
									/>)}
								</div>
								<Footer>Обновлено {rating.date}</Footer>
							</div>)}
						</div>
					</div>
				</Group>
				{this.state.snackbar}
			</Panel>
		);
	};
};
export default PANEL;