import React from 'react';
import {
	Panel,
	Group,
	CardGrid,
	Card,
	SimpleCell,
	Avatar,
	Button
} from '@vkontakte/vkui';
import { Icon56DonateOutline } from '@vkontakte/icons';

class PANEL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: null
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
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord-helper/media/images/';
		const title = 'Доны';
		const description = 'Мой профиль';
		const avatar = 'labels/28.png';
		return (
			<Panel id={this.props.id}>
				{!state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
				<Group>
					{state.isDesktop && options.getPanelHeader(title, description, avatar, this.props.id, parent)}
					{dataDonutUser == [] && <Placeholder action={<Button href="https://vk.com/donut/wiki.warlord" target="_blank" size="m" mode="commerce">Узнать подробнее</Button>} icon={<Icon56DonateOutline width="56" height="56" style={{color: '#ffae26'}} />} header="VK Donut">Донов пока нет,<br/>но ты можешь быть первым</Placeholder>}
					{dataDonutUser.response && dataDonutUser.response.count > 0 && 
						<CardGrid size={state.isDesktop ? "s" : "m"}>
						{dataDonutUser.response.items.map((data, x) => {
							return (
								<Card key={x} className='DescriptionCardWiki'>
									<SimpleCell
										href={`https://vk.com/id${data.id}`}
										target='_blank'
										before={<Avatar size={32} mode="app" src={data.photo_200} />}
										description={data.id}
									>
										{data.first_name} {data.last_name}
									</SimpleCell>
								</Card>
							)
						})}
						</CardGrid>
					}

				</Group>
				{this.state.snackbar}
			</Panel>
		);
	};
};
export default PANEL;