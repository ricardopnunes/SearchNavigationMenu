/*! searchNavMenu.js v2.1 | ABAKUS PLUS d.o.o. | Andrej Grlica | andrej.grlica@abakus.si */
/* ==========================================================================
   Description:
	Script is used for Search Navigation Menu in Oracle Application Express
   -------------------------------------------------------------------------------
	Parameters : 
		item_id = item id from apex
		menuOptions = (additional menu options)
		elm = object
		e = event
		ajaxIdentifier = name of ajax call function
		l_skey = character keypress focus on search
*/

var SNMClosed = false;
var SNMOptions =
				{
					"MenuOpen": false,
					"MenuClickOpenClose": true,
					"SaveSS": true,
					"ShortcutSaveSS": false,
					"ShrtCaseSensitive": true,
					"OnSearchShowChildren": true,
					"UseFocus":true,
					"Shortcuts": []
				};


/**
 * 
 * @param {Array} p_shortcuts
 * @returns {void} 
 * 
 * Função setSNMShortcuts(p_shortcuts) serve para setar os atalhos no objeto SNMOptions
 * 
 * Isso significa que ela atualiza os atalhos definidos para o objeto SNMOptions, permitindo que você personalize os atalhos de acordo com suas necessidades.
 */
function setSNMShortcuts(p_shortcuts) {
	SNMOptions.Shortcuts = p_shortcuts;
}

/**
 * 
 * @param {Array} p_shortcuts 
 * @returns {void}
 * 
 * Função appendSNMShortcut(p_shortcuts) que adiciona ao final do array de atalhos definido na propriedade Shortcuts do objeto SNMOptions.
 * 
 * Basicamente, ela é usada para adicionar novos atalhos à lista de atalhos existente no objeto SNMOptions.
 */
function appendSNMShortcut(p_shortcuts) {
	(SNMOptions.Shortcuts).push(p_shortcuts);
}

/**
 * Essa função openModalSNMHelp() é responsável por abrir um modal de ajuda no contexto do aplicativo. 
 * 
 * Ela invoca uma função chamada openModalSNM passando dois argumentos: o primeiro é uma string "SNM_Help", que é o nome para o modal de ajuda.
 * E o segundo é o resultado da chamada de outra função chamada getHelpSNM(). Presumivelmente, getHelpSNM() é uma função que retorna o conteúdo a ser exibido no modal de ajuda.
 * @returns {void}
 */
function openModalSNMHelp() {
	openModalSNM("SNM_Help", getHelpSNM());
}

/**
 * Essa função, openSNMChildrenIfExists(), é responsável por verificar se a opção OnSearchShowChildren no objeto SNMOptions está habilitada.
 * 
 * Se estiver habilitada, ela percorre os elementos HTML correspondentes a itens de menu (li) que possuem a classe is-expandable ou is-collapsible, e que estão visíveis (style="display: block;"). 
 * Em seguida, para cada um desses elementos, verifica se contém um elemento strong ou se não contém um elemento ul e strong. 
 * Se alguma dessas condições for verdadeira, o elemento é exibido, alterando seu estilo para display: grid.
 * @returns {void}
 */
function openSNMChildrenIfExists() {
	if (SNMOptions.OnSearchShowChildren)
		$('li[id^="t_TreeNav"].is-expandable[style="display: block;"]').children("ul").children("li").each(function () {
			if ($(this).has( "strong" ).length || ($(this).has( "ul" ).length == false && $(this).has( "strong" ).length == false))
				$(this).css("display", "grid"); 
		});
		$('li[id^="t_TreeNav"].is-collapsible[style="display: block;"]').children("ul").children("li").each(function () {
			if ($(this).has( "strong" ).length || ($(this).has( "ul" ).length == false && $(this).has( "strong" ).length == false))
				$(this).css("display", "grid"); 
		});		
}

/**
 *
 * @param {string} 		item_id		 	- O identificador do item de navegação do menu.
 * @param {SNMOptions} 	menuOptions 	- As opções do menu.
 * @param {string} 		ajaxIdentifier 	- O identificador para solicitações AJAX relacionadas ao menu.
 * @param {string} 		l_skey 			- O atalho de teclado para focar na caixa de busca.
 * @param {string} 		elmVal 			- O valor inicial do campo de busca.
 * @returns {void}
 * 
 * Essa função LoadSearchNavMenu() é responsável por inicializar e configurar o menu de navegação de busca. Vou explicar o que ela faz em partes:
 * 
 * 1) Se menuOptions for fornecido, as opções do menu (SNMOptions) são definidas com base nesse objeto.
 * 		As opções ajaxId e ItemId do SNMOptions são definidas com os valores de ajaxIdentifier e item_id, respectivamente.
 * 
 * 2) Se a opção MenuClickOpenClose estiver ativada, um evento de clique é adicionado aos itens do menu para abrir e fechar o submenu quando não houver um link (a) dentro do conteúdo do item.
 * 		Se a opção SaveSS estiver ativada, o valor elmVal é definido como o valor do campo de entrada (input) com a classe srch_input.
 * 
 * 3) Eventos de keydown, keyup e input são associados ao campo de entrada input.srch_input, chamando funções keyDownSearchNav, keyUpSearchNav e uma lógica para limpar o campo quando necessário.
 * 
 * 4) Um evento de clique é associado ao campo de entrada input.srch_input para evitar o comportamento padrão de alguns navegadores ao clicar nele.
 * 
 * 5) Um evento é associado ao redimensionamento da janela para lidar com o ajuste do menu de navegação de busca.
 * 
 * 6) Se l_skey for fornecido (provavelmente um atalho de teclado), um evento de teclado é associado ao documento para acionar a função shortCutSearchNav quando o atalho for pressionado.
 * 
 * 7) Quando o documento estiver pronto, várias ações são executadas, incluindo a abertura de todos os submenus, 
 * 		a definição do item de navegação atual, a exibição de todos os submenus (se a opção MenuOpen estiver ativada) e o foco no elemento atual, se a opção UseFocus estiver ativada.
 */
function LoadSearchNavMenu(item_id, menuOptions, ajaxIdentifier, l_skey, elmVal) {
	if (menuOptions)
		SNMOptions = menuOptions;

	SNMOptions.ajaxId = ajaxIdentifier; 
	SNMOptions.ItemId = item_id; 
	if (SNMOptions.MenuClickOpenClose)
		$("#t_Body_nav #t_TreeNav").on("click", "ul li.a-TreeView-node div.a-TreeView-content:not(:has(a))", function() {
			$(this).prev("span.a-TreeView-toggle").click();
		});	
		
	if (SNMOptions.SaveSS)
		$("input.srch_input").val(elmVal);		
	
    //Add events on items
    //----- KeyDOWN
    $("input.srch_input").keydown(function(e) {
		keyDownSearchNav($(this), e);
		//openSNMChildrenIfExists();
    });
    
	//----- KeyUP
    $("input.srch_input").keyup(function(e, pageEvent) {
		keyUpSearchNav($(this), e, pageEvent);
    }); 

		
	//----- Clear field IE problem, it's not on KEYUP
	$("input.srch_input").bind('input propertychange', function(e, pageEvent) {
		if (this.value == "") {
			setCurrentNav(item_id);
			if (!pageEvent)
				saveSesSateNav("");
		}
	});
	
    //----- Click on input bar, prevent default "Chrome problem".
    $("input.srch_input").on("click", function(e){e.preventDefault(); return false;});
 
    apex.jQuery(window).on("apexwindowresized", function(e) {
            onResizeWinSearchNav();
    });

    //    ----- Keybind to focus on Search Box. Ctrl + User Selected Key (Default = S)
    if (l_skey)
		SNMOptions.skey = l_skey;
		$(document).on("keydown", function(e){
			shortCutSearchNav(e, l_skey);
        });	
		
	addModalSNM("SNM_Help", "Search Navigation Menu HELP");
	
	//---- On document ready	
	$(function() {
		var currItem = document.activeElement;
		if (!isNavTreeOpen()){
			SNMClosed=true;
		}
		openAllNavSubmenus();
		$('li[id^="t_TreeNav"].is-collapsible').find('span.a-TreeView-toggle').click(); 
		//Because all list were open and last one closed we need to open current list
		setCurrentNav(item_id);
		
		if (SNMOptions.MenuOpen)
			showAllSublistsSearchNav();

		if (SNMOptions.UseFocus)
			currItem.focus();
	});	
}

/**
 * 
 * @param {HTMLElement} elm
 * @returns {void}
 * Essa função, openAllNavSubmenus(), tem a finalidade de abrir todos os submenus do menu de navegação.
 * 
 * Ela recebe um parâmetro elm, que é um elemento HTML correspondente a um item de menu. 
 * A função percorre todos os elementos HTML que são identificados como expandíveis (is-expandable) dentro do elemento fornecido, 
 * clicando no ícone de alternância (span.a-TreeView-toggle) para abrir o submenu correspondente.
 * 
 * Além disso, a função chama recursivamente a si mesma com cada elemento filho expandível, garantindo que todos os submenus sejam abertos. 
 * Isso cria um comportamento de abertura em cascata, onde todos os submenus dentro do menu de navegação são expandidos.
 */
function openAllNavSubmenus(elm) {
	var l_elm="";
	if (elm)
		l_elm="li[id="+elm.attr("id")+"] ";
	$(l_elm+'li[id^="t_TreeNav"].is-expandable').each(function() {
		$(this).find("span.a-TreeView-toggle").click();
		openAllNavSubmenus($(this));
	});
}


/**
 * 
 * @param {String} item_id
 * @returns {void}
 * Essa função, setCurrentNav(), tem a finalidade de atualizar a aparência do menu de navegação com base no item atualmente selecionado. Aqui está uma explicação passo a passo do que ela faz:
 * 
 * 1) A função percorre todos os elementos <li> dentro do menu de navegação, que têm um ID que começa com "t_TreeNav".
 * 
 * 2) Para cada item do menu, ela verifica se o primeiro elemento <div> dentro dele possui a classe "is-current" (indicando que é o item atualmente selecionado).
 *		Se for encontrado um item atual, ele adiciona a classe "is-selected" ao elemento <div> que contém a classe "a-TreeView-row".
 *		Se o item atual também for um item expansível (possui a classe "is-expandable"), ele clicará no ícone de alternância para mostrar seus subitens.
 *
 * 3) Se o item atual estiver marcado com a classe "is-current--top", indica que é um item de nível superior. 
 * 		Nesse caso, ela também clicará no ícone de alternância para mostrar seus subitens.
 * 
 * 4) Se o item não for o item atual, remove a classe "is-selected" do elemento <div> que contém a classe "a-TreeView-row".
 * 
 * 5) Se SNMClosed for falso (indicando que o menu de navegação não está fechado), ele aciona um evento "keyup" no campo de busca (input.srch_input) para atualizar os resultados da pesquisa.
 * 		Caso contrário, se SNMClosed for verdadeiro, a função showHideSearchBar é chamada para mostrar ou ocultar a barra de pesquisa, dependendo do estado atual.
 * 
 * Essencialmente, esta função garante que o item selecionado seja visualmente destacado no menu de navegação e controla a exibição da barra de pesquisa com base no estado do menu de navegação.
 * 
 */
function setCurrentNav(item_id) {
	$('li[id^="t_TreeNav"]').each( function(){
        if ($(this).find("div.a-TreeView-content:first").hasClass("is-current")) {
            $(this).find("div.a-TreeView-row:first").addClass("is-selected");
            if ($(this).hasClass("is-expandable"))
                $(this).find("span.a-TreeView-toggle:first").click();  
       }
	   else if ($(this).find("div.a-TreeView-content:first").hasClass("is-current--top")) {
			$(this).find("span.a-TreeView-toggle:first").click(); 
	   }
       else
           $(this).find("div.a-TreeView-row:first").removeClass("is-selected");
    });
	if (!SNMClosed){
		$('input.srch_input').trigger("keyup", [true]);
		// $('#t_Button_navControl').click();
	}else{	
		showHideSearchBar(item_id);
	}
}


/**
 * 
 * @returns {boolean}
 * 
 * Esta função, isNavTreeOpen, verifica se o menu de navegação está aberto ou fechado.
 * E retorna True ou False.
 */
function isNavTreeOpen() {
	try {
		return apex.theme42.toggleWidgets.isExpanded("nav");
	}
	catch(e) {
		apex.debug.info("Error: apex.theme42.toggleWidgets.isExpanded('nav') doesn't exist before Oracle APEX 5.1 errormsg: "+e);
		return $('body').hasClass('js-navExpanded');
	}
}


/**
 * Redireciona para uma URL especificada.
 * 
 * @param {string} redirectURL - A URL para a qual redirecionar.
 * @param {boolean} pNewWindow - Indica se o redirecionamento deve ser aberto em uma nova janela.
 * @returns {void}
 * Esta função redireciona para uma URL especificada. Ela pode ser usada para redirecionar para uma nova página no mesmo navegador ou para abrir uma nova janela ou guia, dependendo do parâmetro `pNewWindow`.
 * 
 * Se `redirectURL` estiver especificada e `pNewWindow` for falso, a página atual será redirecionada para a URL especificada.
 * 
 * Se `redirectURL` estiver especificada e `pNewWindow` for verdadeiro, a URL será aberta em uma nova janela ou guia.
 * 
 * Se `SNMOptions.ShortcutSaveSS` for falso e a URL começar com "javascript:", o campo de entrada de pesquisa será limpo e a navegação atual será atualizada.
 */

function redirectUrlSNM(redirectURL, pNewWindow) {
	if (redirectURL && !pNewWindow) {
		window.location.href = redirectURL;
		if (!SNMOptions.ShortcutSaveSS && redirectURL.toLowerCase().indexOf("javascript:") == 0) {
			$("input.srch_input").val("");
			setCurrentNav(SNMOptions.ItemId);
		}
	}
	else if (redirectURL && pNewWindow) {
		if (!SNMOptions.ShortcutSaveSS) {
			$("input.srch_input").val("");
			setCurrentNav(SNMOptions.ItemId);
		}
		window.open(redirectURL, "_blank");
	}
}

/**
 * Função saveSesSateNav(newVal, redirectURL, pNewWindow) que salva o estado da sessão de navegação.
 * 
 * @param {any} newVal - O novo valor a ser salvo para o estado da sessão.
 * @param {string} redirectURL - A URL para redirecionar após salvar o estado da sessão.
 * @param {boolean} pNewWindow - Um indicador booleano que determina se o redirecionamento deve ser aberto em uma nova janela.
 * @returns {void}
 */

function saveSesSateNav(newVal, redirectURL, pNewWindow) {
	if (SNMOptions.SaveSS) {
		apex.server.plugin( SNMOptions.ajaxId, {
			x01: newVal
		}, {dataType:"json", 
			accept: "application/json",
			success: function( pData ) {
				if(pData.state == 'OK') {
					apex.debug.info("Saved session state.");  
					redirectUrlSNM(redirectURL, pNewWindow);
				}
				else
					apex.debug.error("Saving the session state for Search Navigation failed: "+JSON.stringify(pData)  );
		   },
		   error: function( pData ) {
			 apex.debug.error("Saving the session state for Search Navigation failed: "+JSON.stringify(pData) );
		   }
		}); 
	}
	else {
		redirectUrlSNM(redirectURL, pNewWindow);
	}
}

/**
 * Função showHideSearchBar(item_id) que mostra ou oculta a barra de pesquisa com base no estado do menu de navegação.
 * @param {string} item_id - O ID do item a ser manipulado.
 * @returns {void}
 */

function showHideSearchBar(item_id) {
  if (isNavTreeOpen()) {
	$('input.srch_input').trigger("keyup", [true]);
	$('input.srch_input').trigger("keyup", [true]);

	console.log('isNavTreeOpen()');
  }
  else {
	console.log('!isNavTreeOpen()');
	$('input.srch_input').trigger("keyup", [true]);
	$('input.srch_input').trigger("keyup", [true]);
	$('input.srch_input').trigger("keyup", [true]);
	$('input.srch_input').trigger("keyup", [true]);
	hideAllSublistsSearchNav();
  }
}

/**
 * Oculta todas as sublistas do menu de navegação.
 * @returns {void}
 */
function hideAllSublistsSearchNav() {
    $('li[id^="t_TreeNav"].is-expandable').find("ul").css("display", "none");
}

/**
 * Mostra todas as sublistas do menu de navegação.
 * @returns {void}
 */
function showAllSublistsSearchNav() {
    $('li[id^="t_TreeNav"].is-expandable').find("ul").css("display", "grid");
}

/**
 * Realça uma parte específica de um texto com base em uma string de substituição.
 * @param {string} txt - O texto original que será modificado.
 * @param {string} rplStr - A string que será realçada no texto original.
 * @returns {string} - O texto modificado com a parte realçada.
 */

function colorSearchNav(txt, rplStr) {
    var loc = txt.toLowerCase().indexOf(rplStr.toLowerCase());
    if (loc != -1) {
        return txt.slice(0, loc) + '<strong>' + txt.slice(loc, loc + rplStr.length) + '</strong>' + txt.slice(rplStr.length + loc, txt.length);
    }
    return txt;
}


/**
 * Ativa o efeito de destaque ao passar o mouse sobre os itens do menu de navegação.
 * @returns {void}
 */
function hoverSearchNav() {
    $('li[id^="t_TreeNav_"] div.is-hover').removeClass("is-hover");
    $('li[id^="t_TreeNav_"][style*="display: block"] a.a-TreeView-label strong').each(function() {
        $(this).parents("li").eq(0).children("div").addClass("is-hover");
        return false;
    });
}

/**
 * Avança ou retrocede para o próximo item destacado no menu de navegação.
 * @param {boolean} reverse - Um indicador booleano que determina se o movimento é para frente (false) ou para trás (true).
 * @returns {void}
 */
function stepNextSearchNav(reverse) {
    var obj = $('li[id^="t_TreeNav_"] div.is-hover'),
        newObj,
        flg; //flg for flag next object
    if (obj[0]) {
        obj.removeClass("is-hover");
        $('li[id^="t_TreeNav_"][style*="display: block"] a.a-TreeView-label strong').each(function() {
            if ($(this).parents("li").eq(0).attr("id") == obj.parent("li").attr("id") && reverse)
                return false;
            else if (flg) {
                newObj = $(this).parents("li").eq(0);
                return false;
            } else if ($(this).parents("li").eq(0).attr("id") == obj.parent("li").attr("id") && !reverse && !flg) {
                flg = true;
                newObj = $(this).parents("li").eq(0);
            } else
                newObj = $(this).parents("li").eq(0);
        });
        if (newObj)
            $(newObj).children("div").addClass("is-hover");
        else
            $(obj).addClass("is-hover");
    } else
        hoverSearchNav();
}

/**
 * Analisa um atalho específico e retorna a URL correspondente com base nos parâmetros fornecidos.
 * @param {object} obj - O objeto contendo informações sobre o atalho.
 * @param {string} elmVal - O valor do elemento relacionado ao atalho.
 * @returns {string} - A URL correspondente ao atalho analisado.
 */
function parseSNMShortcut(obj, elmVal) {
	var retURL = "";
	
	if ("action" in obj) {
		var l_clearCache="", l_page_id = $v("pFlowStepId");
		if (obj.page_id)
			l_page_id = obj.page_id;
		if (obj.clearCache)
			if ("clearCacheList" in obj)
				l_clearCache = obj.clearCacheList;
			else
				l_clearCache = l_page_id; 
		
		if (obj.action.toLowerCase() == "page" && !elmVal) 
			retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+":::"+l_clearCache+"::"
		else if (obj.action.toLowerCase() == "url" && !elmVal) {
			if (obj.url)
				retURL = obj.url;
		}
		else if (obj.action.toLowerCase() == "ir") {
			var ir_link="IR";
			if ("IR_static_id" in obj)
				ir_link+="["+obj.IR_static_id+"]";
			if ("IR_operator" in obj)
				ir_link+=obj.IR_operator+"_";
			if ("IR_type" in obj)
				if (obj.IR_type.toLowerCase() == "column")
					if ("IR_column" in obj)
						ir_link+=obj.IR_column;
					else
						ir_link+="ROWFILTER";
				else
					ir_link+="ROWFILTER";		
			else
				ir_link+="ROWFILTER";	
			if (l_clearCache) {
				if ("IR_clearCache" in obj)
					l_clearCache +=","+obj.IR_clearCache;
			}
			else {
				if ("IR_clearCache" in obj)
					l_clearCache = obj.IR_clearCache;				
			}
			if (elmVal)
				retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+":::"+l_clearCache+":"+ir_link+":"+elmVal;
			else
				if ("IR_value" in obj)	
					retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+":::"+l_clearCache+":"+ir_link+":"+obj.IR_value;
		}		
		else if (obj.action.toLowerCase() == "item") {
			if (elmVal) {
				if ("item_name" in obj)	
					retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+":::"+l_clearCache+":"+obj.item_name+":"+elmVal;
			}
			else 
				if ("item_name" in obj && "item_value" in obj)
					retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+":::"+l_clearCache+":"+obj.item_name+":"+obj.item_value;			
		}	
	}
	if (retURL)
		apex.debug.info("Object:"+JSON.stringify(obj)+" returning URL :'"+retURL+"'");
	return retURL;
}

/**
 * Redireciona com base no objeto de atalho especificado.
 * @param {object} 	obj 		- O objeto de atalho a ser utilizado para o redirecionamento.
 * @param {boolean} startWith 	- Um indicador booleano que indica se o redirecionamento deve começar com o valor do elemento.
 * @param {string} 	elmVal 		- O valor do elemento relacionado ao atalho.
 * @returns {boolean} 			- Retorna true se o redirecionamento for bem-sucedido, caso contrário, retorna false.
 */

function redirectSNM(obj, startWith, elmVal) {
	var rdr, l_newWindow, valSessionState="";
	if (SNMOptions.ShortcutSaveSS)
		valSessionState=elmVal;
	if(obj) {
		if (obj.newWindow)
			l_newWindow = true;
		if (startWith) 
			rdr=parseSNMShortcut(obj, elmVal.substr(obj.name.length+1, elmVal.length-obj.name.length+1));
		else 
			rdr=parseSNMShortcut(obj);
		
		if (rdr) {
			saveSesSateNav(valSessionState, rdr, l_newWindow); 
			return true;
		}
	}
	else {	
		rdr = $('li[id^="t_TreeNav_"][style*="display: block"] div.is-hover a.a-TreeView-label').attr("href");
		if (rdr) {
			window.location.href = rdr;
			return true;
		}
	}
	return false;
}


/**
 * Verifica se um atalho corresponde ao valor de um elemento e redireciona conforme necessário.
 * @param {HTMLElement} elm - O elemento HTML cujo valor será verificado.
 * @returns {void}
 */
function checkAndRedirectSNM(elm) {
	var elmVal = $(elm).val(), find_shortcut = false, caseSensitive;
	if (SNMOptions.ShrtCaseSensitive)
		caseSensitive=true;
	if (!jQuery.isEmptyObject(SNMOptions.Shortcuts)) {
		for(var i=0; i<SNMOptions.Shortcuts.length; i++) {
			if ((SNMOptions.Shortcuts[i].name == elmVal && caseSensitive) || (SNMOptions.Shortcuts[i].name.toLowerCase() == elmVal.toLowerCase() && !caseSensitive)) {
				find_shortcut = redirectSNM(SNMOptions.Shortcuts[i]);
			}
			else if ((elmVal.indexOf(SNMOptions.Shortcuts[i].name+":") == 0 && caseSensitive) ||
					 (elmVal.toLowerCase().indexOf(SNMOptions.Shortcuts[i].name.toLowerCase()+":") == 0  && !caseSensitive)) {
					find_shortcut = redirectSNM(SNMOptions.Shortcuts[i], true, elmVal);
			}
			if (find_shortcut) { break; }
		}
	}
	if (!find_shortcut)
		find_shortcut = redirectSNM();
}

/*  EVENTS........ */

/**
 * Adiciona um modal à página com o nome e título especificados.
 * @param {string} name - O ID do modal a ser adicionado.
 * @param {string} title - O título do modal.
 * @returns {void}
 */

function addModalSNM(name, title) {
	$('body').append('<div id="'+name+'" />')
	
	$("#"+name).dialog(
		{"modal":true
		,"title":title
		,"autoOpen":false
		,"resizable":true
		,"dialogClass":"no-close srch_modal"
		,"width":'500px'
		,"closeOnEscape":true
		,buttons : {
				"Close" : function () {
					$(this).dialog("close");
				}
			}
		}
	);
}

/**
 * Abre o modal especificado com uma mensagem.
 * @param {string} name - O ID do modal a ser aberto.
 * @param {string} p_msg - A mensagem a ser exibida no modal.
 * @returns {void}
 */

function openModalSNM(name, p_msg) {
	$("#"+name)
	.css('margin','12px') 	// Make dialog text easier to read.
	.html(p_msg) 			// Generate the message.
	.dialog('open'); 		// Open the dialog.
}

/**
 * Retorna uma mensagem de ajuda com os atalhos disponíveis.
 * @returns {string} - A mensagem de ajuda formatada em HTML.
 */
function getHelpSNM() {
	var l_return = "<h3>Shortcuts :</h3>";
	l_return +="<table>";
	l_return +="<tr><td class=\"td_right\"><strong>CTRL+"+SNMOptions.skey+" :</strong></td><td colspan=\"4\">Focus on search box item</td></tr>";
	l_return +="<tr><td class=\"td_right\"><strong>F1 :</strong></td><td colspan=\"4\">Opens search navigation menu help page</td></tr>";
	
	if (!jQuery.isEmptyObject(SNMOptions.Shortcuts)) {
		   l_return +="<tr class=\"tr_bg\"><td>Shortcut label</td><td>Type</td><td>Condition</td><td>Example (type in)</td></tr>";
		for(var i=0; i<SNMOptions.Shortcuts.length; i++) {
			l_return +="<tr><td><strong>"+SNMOptions.Shortcuts[i].name+"</strong></td><td>"+SNMOptions.Shortcuts[i].action+"</td>";
			l_return +="<td>";
			if (SNMOptions.Shortcuts[i].action.toLowerCase()=="ir") {
				if (SNMOptions.Shortcuts[i].IR_type.toLowerCase()=="column") {
					if ("IR_column" in SNMOptions.Shortcuts[i])
						l_return +="column "+SNMOptions.Shortcuts[i].IR_column.toUpperCase()+" ";
				}
				else
					l_return +="row ";
					
				if ("IR_operator" in SNMOptions.Shortcuts[i]) {
					if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "C")
						l_return +="contains";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "GTE")
						l_return +="greather than or equal to";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "GT")
						l_return +="greather than";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "LIKE")
						l_return +="like";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "LT")
						l_return +="less than";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "LTE")
						l_return +="less than r equal to";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "N")
						l_return +="null";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NC")
						l_return +="not cointains";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NEQ")
						l_return +="not equals";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NLIKE")
						l_return +="not like";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NN")
						l_return +="not null";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NIN")
						l_return +="not in";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "IN")
						l_return +="in";
					else 
						l_return +="equals";					
				}
				else			
					l_return +="contains";
			}
			l_return +="</td>";	
			
			if ("example" in SNMOptions.Shortcuts[i])
				l_return +="<td>"+SNMOptions.Shortcuts[i].example+"</td>";
			else	
				l_return +="<td></td>";	
			l_return +="</tr>";
		}
	}
	l_return +="</table>";
	return l_return;
}

/**
 * Manipula eventos de pressionamento de tecla para navegação de busca.
 * @param {HTMLElement} elm - O elemento HTML relacionado ao evento.
 * @param {Event} e - O evento de pressionamento de tecla.
 * @returns {void}
 */
function keyDownSearchNav(elm, e) {
	switch (e.which) {
		   case 13:
		       checkAndRedirectSNM(elm);
			   e.preventDefault();
			  break;
		   case 40:
			  stepNextSearchNav(false);  
			  e.preventDefault();
			  break;
		   case 38:
			  stepNextSearchNav(true);
			  e.preventDefault();   
			  break;			  
			case 112:
			  openModalSNMHelp();
			  e.preventDefault(); 	
			  break;
	}
}


/**
 * Manipula eventos de soltura de tecla para navegação de busca.
 * @param {HTMLElement} elm - O elemento HTML relacionado ao evento.
 * @param {Event} e - O evento de soltura de tecla.
 * @param {boolean} pageEvent - Um indicador booleano que indica se o evento ocorreu na página.
 * @returns {void}
 */

//elm= input, e=event, paegeEvent=keyup of hide/show
function keyUpSearchNav(elm, e, pageEvent) {
	switch (e.which) {
	   case 13:
	   case 17:
	   case 40:
	   case 38:
	   case 112:
		   e.preventDefault();
		   break;
	   default:
		var elmVal = $(elm).val(), save_ss = false;
		 $(".a-TreeView-label strong").replaceWith(function() { return $(this).html(); }); 
		 if (elmVal != "") {
			 $('li[id^="t_TreeNav"]').each(function() {
			   if ($(this).find(".a-TreeView-label").text().toLowerCase().indexOf(elmVal.toLowerCase())!= -1 ) {
				   if ($(this).hasClass("is-expandable"))
					   $(this).find("ul").css("display", "grid");
				   $(this).find(".a-TreeView-label").each(function(){
					   $(this).html(colorSearchNav($(this).text(),elmVal)); 
				   });
				   $(this).css("display", "grid"); 
			   }
			   else
				 $(this).css("display", "none");

			
				if ($(this).closest("ul").css('display') != 'none' && $(this).hasClass("is-expandable")){
					$(this).removeClass("is-expandable").addClass("is-collapsible");
				}
			  });
		}
		else {
		   $('li[id^="t_TreeNav"]').each(function() {
			  if ($(this).hasClass("is-expandable"))
					  $(this).find("ul").css("display", "none");
			  $(this).css("display", "grid");

			if ($(this).closest("ul").css('display') != 'none' && $(this).hasClass("is-collapsible")){
				$(this).removeClass("is-collapsible").addClass("is-expandable");
				
			}

		   });
		}        
		if (!pageEvent)
			saveSesSateNav(elmVal); 
		hoverSearchNav();
		openSNMChildrenIfExists();
		if (SNMOptions.UseFocus)
		// $('.t-PageBody:not(.js-navExpanded) #t_Button_navControl').click();
		$f_First_field();
		
	}    
}

/**
 * Manipula eventos de atalho para abrir a barra de navegação de busca.
 * @param {Event} e - O evento de pressionamento de tecla.
 * @param {string} l_skey - A tecla de atalho para abrir a barra de navegação de busca.
 * @returns {boolean} - Retorna false para prevenir o comportamento padrão do navegador.
 */

function shortCutSearchNav(e, l_skey) {
	if(e.ctrlKey && e.keyCode === l_skey.charCodeAt(0)){ 
		if (!isNavTreeOpen())
			$('#t_Button_navControl').click();
		var tmp = $("input.srch_input").val();
		$("input.srch_input").focus().val(tmp);
		e.preventDefault();
		return false;
	}	
}

/**
 * Manipula eventos de redimensionamento da janela para a barra de navegação de busca.
 * @returns {void}
 */
function onResizeWinSearchNav() {
	try{
		if ($("input.srch_input").is(":focus"))
				   apex.theme42.toggleWidgets.expandWidget("nav");
		else {
			if (!isNavTreeOpen())
				hideAllSublistsSearchNav();
		}
	}catch{
		$('#t_Button_navControl').click();
	}
}