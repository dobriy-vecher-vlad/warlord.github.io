import React from 'react';
import {
	Panel,
	Group,
	Avatar,
	Button,
	Spacing
} from '@vkontakte/vkui';
import { Icon56DonateOutline, Icon28ChevronLeftOutline, Icon28Chevrons2LeftOutline } from '@vkontakte/icons';
import TableCell from '../../components/tableCell';

class PANEL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: null,
			donutsPage: 0,
		};
	};
	async componentDidMount() {
		console.log('[PANEL] >', this.props.id);
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
	};
	async componentDidUpdate() {
		!this.props.state.isDesktop && this.props.options.updateFixedLayout();
	};
	async shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.state.snackbar!=this.state.snackbar&&nextState.snackbar==this.state.snackbar) this.setState({ snackbar: nextProps.state.snackbar });
		if (nextState.snackbar!=this.state.snackbar) return true;
		return false;
	}
	render() {
		const { state, options, parent, dataDonutUser } = this.props;
		const { donutsPage } = this.state;
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord-helper/media/images/';
		const title = 'Доны';
		const description = 'Мой профиль';
		const avatar = 'labels/28.png';
		const grid = state.isDesktop ? {display: 'grid', alignItems: 'center', gridTemplateColumns: '40px 32px auto auto', gridGap: '8px'} : {display: 'grid', alignItems: 'center', gridTemplateColumns: '40px 32px auto auto', gridGap: '16px'};
		const count = 50;
		return (
			<Panel id={this.props.id}>
				{!state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
				<Group>
					{(dataDonutUser != [] && dataDonutUser.response && dataDonutUser.response.count > 0)?<React.Fragment>
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
									><span>id</span></div>
								</div>
							</div>
							<Spacing size={8} />
						</div>
						<div className="Scroll HorizontalRating" style={{maxHeight: state.isDesktop ? '392px' : 'unset', minHeight: state.isDesktop ? 'unset' : 'unset'}}>
							{dataDonutUser.response.items.slice(donutsPage*count, (donutsPage+1)*count).map((data, x) => <TableCell
								key={x}
								count={options.numberSpaces(donutsPage*count+x+1, ' ')}
								href={`https://vk.com/id${data.id}`}
								style={grid}
								avatar={<Avatar size={32} src={data.photo_200} />}
								rows={[{
									title: `${data.first_name} ${data.last_name}`
								}, {
									title: data.id
								}]}
							/>)}
						</div>
						<div className='Sticky Sticky__bottom withSeparator'>
							<Spacing size={10} />
							<div className="TableCell">
								<div className="TableCell__content">
									<div className="TableCell__row">
										<span style={{color: 'var(--text_secondary)'}}>Показана {options.numberSpaces(donutsPage+1, ' ')} страница из {options.numberSpaces(Math.ceil(dataDonutUser.response.items.length/count), ' ')}</span>
										<span style={{display: 'flex'}}>
											<Button mode="tertiary" className="ButtonIcon" onClick={() => this.setState({ donutsPage: 0 })} disabled={donutsPage<=0}><Icon28Chevrons2LeftOutline/></Button>
											<Button mode="tertiary" className="ButtonIcon" onClick={() => this.setState({ donutsPage: donutsPage-1 })} disabled={donutsPage<=0}><Icon28ChevronLeftOutline/></Button>
											<Button mode="tertiary" className="ButtonIcon" onClick={() => this.setState({ donutsPage: donutsPage+1 })} disabled={donutsPage>=Math.ceil(dataDonutUser.response.items.length/count)-1}><Icon28ChevronLeftOutline style={{transform: 'rotate(180deg)'}}/></Button>
											<Button mode="tertiary" className="ButtonIcon" onClick={() => this.setState({ donutsPage: Math.ceil(dataDonutUser.response.items.length/count)-1 })} disabled={donutsPage>=Math.ceil(dataDonutUser.response.items.length/count)-1}><Icon28Chevrons2LeftOutline style={{transform: 'rotate(180deg)'}}/></Button>
										</span>
									</div>
								</div>
							</div>
							<Spacing size={2} />
						</div>
					</React.Fragment>:<Placeholder action={<Button href="https://vk.com/donut/wiki.warlord" target="_blank" size="m" mode="commerce">Узнать подробнее</Button>} icon={<Icon56DonateOutline width="56" height="56" style={{color: '#ffae26'}} />} header="VK Donut">Донов пока нет,<br/>но ты можешь быть первым</Placeholder>}
				</Group>
				{this.state.snackbar}
			</Panel>
		);
	};
};
export default PANEL;