import React from 'react';
import {
	Spacing,
	Cell,
	Div,
	ModalPage
} from '@vkontakte/vkui';
import {
	Icon24ChainOutline
} from '@vkontakte/icons';

import Items from '../data/items.json';

class MODAL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	};
	async componentDidMount() {
		console.log('[MODAL] >', this.props.id);
	};
	shouldComponentUpdate() {
		return false;
	}
	render() {
		const { state, options, data } = this.props;
		const item = Items[data.id];
		const pathImages = 'https://dobriy-vecher-vlad.github.io/warlord-helper/media/images/';
		return (
			<ModalPage id={this.props.id}>
				<Div style={{padding: state.isDesktop ? 12 : ''}}>
					{(state.checkItems.item || state.checkItems.collection) && 
						options.getItemCell(data, item.id, true)
					}
					{state.checkItems.null && 
						<Cell className="DescriptionWiki" style={{textAlign: 'center'}} description="Нет предметов"></Cell>
					}
					<Spacing separator size={16} />
					<Cell href={`${pathImages}items/${item.id}.png`} target="_blank" className="DescriptionCellButton" before={<Icon24ChainOutline />} description="Ссылка" expandable>Изображение иконки</Cell>
					<Cell href={`${pathImages}items/${item.id}b.png`} target="_blank" className="DescriptionCellButton" before={<Icon24ChainOutline />} description="Ссылка" expandable>Изображение предмета</Cell>
					{item.type == 2 && <Cell href={`${pathImages}items/${item.id}e.png`} target="_blank" className="DescriptionCellButton" before={<Icon24ChainOutline />} description="Ссылка" expandable>Изображение улучшенного предмета</Cell>}
					{!this.props.state.isDesktop&&<Spacing size={8} />}
				</Div>
    		</ModalPage>
		);
	};
};
export default MODAL;