import '../css/common.css';
import Layer from './Component/layer/layer.js'


const App = function () {
	var dom = document.getElementById('app');
	var layer = new Layer();

	dom.innerHTML = layer.tpl({
		name: 'Ejs',
		arr: ['Mi', 'HUAWEI', 'OPPO']
	});
}

new App();