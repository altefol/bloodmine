var selectedCategory = 'ranks';
var selectedIndex = 1;
var selectedTerm = 'На месяц';
var products = {
  ranks: [
    {name: 'Цербер', price: 14}, {name: 'Маркиз', price: 39}, {name: 'Граф', price: 59},
    {name: 'Орион', price: 99}, {name: 'Визирь', price: 149}, {name: 'Феникс', price: 239},
    {name: 'Рыцарь', price: 329}, {name: 'Правитель', price: 529}, {name: 'Властелин', price: 879}, {name: 'Император', price: 1299}
  ],
  cases: [{name: 'Стартовый кейс',price: 19},{name: 'Кейс исследователя',price: 49},{name: 'Кейс героя',price: 99},{name: 'Коллекция сезона',price: 149}],
  shards: [{name: '100 осколков',price: 29},{name: '300 осколков',price: 69},{name: '700 осколков',price: 129},{name: '1500 осколков',price: 249}],
  other: [{name: 'Цветной ник',price: 29},{name: 'Эффект появления',price: 49},{name: 'Набор эмоций',price: 79}]
};
function renderProducts() {
  var list = document.getElementById('product-list');
  if (!list) return;
  list.innerHTML = '';
  products[selectedCategory].forEach(function(item,index) {
    var row = document.createElement('div');
    row.className = 'product-row' + (index === selectedIndex ? ' chosen' : '');
    row.innerHTML = '<span>' + item.name + '</span><span class="product-price">от ' + item.price + ' ₽ ›</span>';
    row.onclick = function(){ selectedIndex = index; renderProducts(); };
    list.appendChild(row);
  });
  var product = products[selectedCategory][selectedIndex];
  document.getElementById('preview-name').textContent = product.name;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('preview-image').src = selectedCategory === 'cases' ? 'assets/images/chest.png' : 'assets/images/player.png';
  var details = selectedCategory === 'ranks'
    ? '<li>Название в чате — <span>' + product.name + '</span></li><li>Оформление профиля — <span>цвет и стиль</span></li><li>Дополнительный набор — <span>предметы</span></li><li>Коллекция эффектов — <span>для персонажа</span></li>'
    : '<li>Выбранный набор — <span>' + product.name + '</span></li><li>Описание игровой коллекции</li><li>Содержимое можно посмотреть в каталоге</li>';
  document.getElementById('product-description').innerHTML = '<ul>' + details + '</ul>';
  document.getElementById('choose-product').textContent = 'Выбрать за ' + product.price + ' ₽';
}
function setCategory(category) {
  selectedCategory = category; selectedIndex = 0;
  document.querySelectorAll('.tab').forEach(function(tab){tab.className = 'tab' + (tab.getAttribute('data-category') === category ? ' active' : '');});
  renderProducts();
}
function setTerm(element,term) {
  selectedTerm = term;
  document.querySelectorAll('.terms span').forEach(function(item){item.className='';});
  element.className='selected';
}
function openDialog(title,text) {
  document.getElementById('dialog-title').textContent=title;
  document.getElementById('dialog-text').textContent=text;
  document.getElementById('dialog').classList.add('visible');
}
function closeDialog(){document.getElementById('dialog').classList.remove('visible');}
function selectProduct(){
  var item=products[selectedCategory][selectedIndex];
  openDialog(item.name,'Вы выбрали «'+item.name+'», срок: '+selectedTerm.toLowerCase()+'. Это демонстрация каталога: оплата и выдача игровых товаров недоступны.');
}
function showReward(name){openDialog(name,'Пример награды «'+name+'». Здесь можно изучить оформление коллекции. Получение предметов на игровом сервере не подключено.');}
function toggleRule(element){
  var rule=element.parentNode;rule.classList.toggle('open');
  element.querySelector('b').textContent=rule.classList.contains('open')?'−':'+';
}
renderProducts();
document.getElementById('dialog').addEventListener('click', function (event) { if (event.target === this) closeDialog(); });

/* =========================================================
   Практическая 17: JS-исправления
   Вставлять в конец app.js
   ========================================================= */

(function () {
    var dialog = document.getElementById("dialog");
    var lastFocused = null;

    function dialogIsOpen() {
        return dialog && dialog.classList.contains("visible");
    }

    function openDialog(title, text) {
        if (!dialog) return;
        lastFocused = document.activeElement;

        var t = document.getElementById("dialog-title");
        var p = document.getElementById("dialog-text");
        if (t) t.textContent = title || "Информация";
        if (p) p.textContent = text || "";

        dialog.classList.add("visible");

        var btn = dialog.querySelector("[data-close-dialog]");
        if (btn) btn.focus();
    }

    function closeDialog() {
        if (!dialog) return;
        dialog.classList.remove("visible");
        if (lastFocused && lastFocused.focus) lastFocused.focus();
        lastFocused = null;
    }

    // Делаем функции глобальными, если их ещё нет
    if (typeof window.closeDialog !== "function") {
        window.closeDialog = closeDialog;
    }
    if (typeof window.openDialog !== "function") {
        window.openDialog = openDialog;
    }

    function toggleRule(heading) {
        var rule = heading.closest(".rule");
        if (!rule) return;

        var isOpen = rule.classList.contains("open");
        rule.classList.toggle("open", !isOpen);
        heading.setAttribute("aria-expanded", String(!isOpen));

        var marker = heading.querySelector("b");
        if (marker) marker.textContent = isOpen ? "+" : "\u2212";
    }

    if (typeof window.toggleRule !== "function") {
        window.toggleRule = toggleRule;
    }

    function hasFn(name) {
        return typeof window[name] === "function";
    }

    // Делегирование кликов
    document.addEventListener("click", function (e) {
        // Вкладки магазина
        var tab = e.target.closest("[data-category]");
        if (tab) {
            var list = tab.closest("[role='tablist']") || document;
            list.querySelectorAll("[data-category]").forEach(function (el) {
                el.classList.remove("active");
                el.setAttribute("aria-selected", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
            if (hasFn("setCategory")) setCategory(tab.dataset.category);
            return;
        }

        // Срок действия
        var term = e.target.closest("[data-term]");
        if (term) {
            var group = term.closest(".terms") || document;
            group.querySelectorAll("[data-term]").forEach(function (el) {
                el.classList.remove("selected");
            });
            term.classList.add("selected");
            if (hasFn("setTerm")) setTerm(term, term.dataset.term);
            return;
        }

        // Выбрать товар
        if (e.target.closest("[data-select-product]")) {
            if (hasFn("selectProduct")) {
                selectProduct();
            } else {
                openDialog("Демонстрация", "Это демо-версия сайта. Оплата и выдача товаров отключены.");
            }
            return;
        }

        // Награды
        var reward = e.target.closest("[data-reward]");
        if (reward) {
            var name = reward.dataset.reward;
            if (hasFn("showReward")) {
                showReward(name);
            } else {
                openDialog(name, "Это демонстрационная награда. Подробное описание будет доступно в реальной версии проекта.");
            }
            return;
        }

        // Аккордеоны
        var toggle = e.target.closest("[data-toggle-rule]");
        if (toggle) {
            toggleRule(toggle);
            return;
        }

        // Закрытие модалки
        if (e.target.closest("[data-close-dialog]")) {
            closeDialog();
        }
    });

    // Клавиатура
    document.addEventListener("keydown", function (e) {
        // Enter / Space для role=button и role=tab
        if (e.key === "Enter" || e.key === " ") {
            var el = e.target.closest("[role='button'], [role='tab']");
            if (el) {
                e.preventDefault();
                el.click();
            }
        }

        // Escape закрывает модалку
        if (e.key === "Escape" && dialogIsOpen()) {
            closeDialog();
        }

        // Focus trap
        if (e.key === "Tab" && dialogIsOpen()) {
            var items = Array.from(
                dialog.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")
            ).filter(function (el) {
                return !el.disabled && el.offsetParent !== null;
            });
            if (!items.length) return;

            var first = items[0];
            var last = items[items.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
})();