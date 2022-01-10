import React from 'react';
import {
	Footer,
	Title,
	TabbarItem,
	Gradient,
	Button,
	Div,
	Counter,
	Avatar,
	Cell,
	ModalPage
} from '@vkontakte/vkui';
import {
	Icon28DonateCircleFillYellow,
	Icon24AddCircleDottedOutline,
	Icon24SkullOutline,
	Icon24CupOutline,
	Icon24Users3Outline,
	Icon24TshirtOutline,
	Icon24MoneyCircleOutline,
	Icon24PollOutline,
	Icon24FavoriteOutline,
	Icon24StickerOutline,
	Icon24LikeOutline
} from '@vkontakte/icons';

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
		return (
			<ModalPage id={this.props.id}>
				<Div style={{padding: 0}}>
					<Gradient style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						padding: 20,
					}}>
						<TabbarItem className="CustomTabbarItem" indicator={<Counter className="BottomStyle Icon"><Icon28DonateCircleFillYellow/></Counter>}><Avatar src="https://dobriy-vecher-vlad.github.io/warlord/wiki-new/media/helpers/group_avatar.png" size={96}/></TabbarItem>
						<Title style={{ marginTop: 20 }} level="2" weight="medium">VK Donut</Title>
						<div style={{ marginTop: 8 }}>Поддержите проект подпиской и получите</div>
					</Gradient>
					<div className="Scroll" style={{height: this.props.state.isDesktop?207:'unset', margin: 8}}>
						<Cell className="DescriptionWiki" before={<Icon24AddCircleDottedOutline />} description="Привязывай профили и получай выгоду на всех">Профили</Cell>
						<Cell className="DescriptionWiki" before={<Icon24SkullOutline />} description="Проходите в автоматическом режиме выбранный рейд всего за 2 минуты">Автоматическое прохождение рейдов</Cell>
						<Cell className="DescriptionWiki" before={<Icon24CupOutline />} description="Набирайте в автоматическом режиме очки арены">Автоматическое прохождение арены</Cell>
						<Cell className="DescriptionWiki" before={<Icon24Users3Outline />} description="Сканируйте всех ваших друзей, выводя их в удобном и сортируемом списке">Сканер друзей</Cell>
						<Cell className="DescriptionWiki" before={<Icon24TshirtOutline />} description="Напротив каждого предмета в приложении будет указываться его наличие у вас">Наличие вещей</Cell>
						<Cell className="DescriptionWiki" before={<Icon24MoneyCircleOutline />} description="Список предметов с подробной информацией">Магазин, Коллекции и Инкрустация</Cell>
						<Cell className="DescriptionWiki" before={<Icon24PollOutline />} description="Считайте затраты на боссов, арену, казну гильдии и предметы ещё эффективнее">Калькуляторы</Cell>
						<Cell className="DescriptionWiki" before={<Icon24FavoriteOutline />} description="Иконка в виде звёздочки в комментариях и доступ к эксклюзивным записям">Значок и стена</Cell>
						<Cell className="DescriptionWiki" before={<Icon24StickerOutline />} description="Эксклюзивные стикеры VK Donut при каждом продлении подписки">Стикеры</Cell>
						<Cell className="DescriptionWiki" before={<Icon24LikeOutline />} description="Вы увеличиваете шанс появления новых функций">Поддержка проекта</Cell>
					</div>
					<div style={{display: 'flex', flexDirection: 'column', padding: '0 8px'}}>
						<Button href="https://vk.com/donut/wiki.warlord" stretched target="_blank" size="l" mode="commerce">Поддержать проект</Button>
						<Footer style={{margin: '12px 0'}}>От 50₽ в месяц</Footer>
					</div>
				</Div>
    		</ModalPage>
		);
	};
};
export default MODAL;