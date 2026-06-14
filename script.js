document.addEventListener('DOMContentLoaded',()=>{
	const selectButtons = document.querySelectorAll('.select-btn')
	const cartList = document.getElementById('cart-list')
	const finishBtn = document.getElementById('finish-btn')
	const clearBtn = document.getElementById('clear-btn')
	const cartHeader = document.querySelector('#cart h3')
	const cartTotalEl = document.getElementById('cart-total')
	const menuBtn = document.getElementById('menu-btn')
	const menuModal = document.getElementById('menu-modal')
	const menuClose = document.getElementById('menu-close')
	const menuList = document.getElementById('menu-list')

	const selected = [] // array of {name, price, quantity}

	function formatPrice(v){
		return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
	}

	function calcTotal(){
		return selected.reduce((s,it)=>s + it.price * it.quantity,0)
	}

	function updateSelectionButtons(){
		selectButtons.forEach(btn => {
			const item = btn.closest('.item')
			const name = item?.dataset.name
			const idx = findSelectedIndexByName(name)
			if(idx > -1){
				btn.classList.add('selected')
				const qty = selected[idx].quantity
				if(qty > 1){
					btn.innerHTML = `Selecionado <span class="qty-badge">${qty}</span>`
				} else {
					btn.textContent = 'Selecionado'
				}
			} else {
				btn.classList.remove('selected')
				btn.textContent = 'Selecionar'
			}
		})
	}

	function updateCart(){
		cartList.innerHTML = ''
		selected.forEach((it)=>{
			const li = document.createElement('li')
			li.dataset.name = it.name

			const itemLabel = document.createElement('div')
			itemLabel.className = 'cart-item-label'
			itemLabel.textContent = `${it.name} - ${it.quantity} x ${formatPrice(it.price)} = ${formatPrice(it.price * it.quantity)}`

			const actions = document.createElement('div')
			actions.className = 'item-actions'

			const decreaseBtn = document.createElement('button')
			decreaseBtn.type = 'button'
			decreaseBtn.className = 'qty-btn decrease'
			decreaseBtn.dataset.name = it.name
			decreaseBtn.setAttribute('aria-label', 'Diminuir quantidade')
			decreaseBtn.textContent = '-'

			const qtyLabel = document.createElement('span')
			qtyLabel.className = 'item-qty'
			qtyLabel.textContent = it.quantity

			const increaseBtn = document.createElement('button')
			increaseBtn.type = 'button'
			increaseBtn.className = 'qty-btn increase'
			increaseBtn.dataset.name = it.name
			increaseBtn.setAttribute('aria-label', 'Aumentar quantidade')
			increaseBtn.textContent = '+'

			const removeBtn = document.createElement('button')
			removeBtn.type = 'button'
			removeBtn.className = 'remove'
			removeBtn.dataset.name = it.name
			removeBtn.setAttribute('aria-label', 'Remover item')
			removeBtn.textContent = 'x'

			actions.append(decreaseBtn, qtyLabel, increaseBtn, removeBtn)
			li.append(itemLabel, actions)
			cartList.appendChild(li)
		})
		const total = calcTotal()
		cartTotalEl.textContent = formatPrice(total)
		const totalItems = selected.reduce((sum,item)=>sum+item.quantity,0)
		cartHeader.textContent = totalItems > 0 ? `Itens selecionados (${totalItems})` : 'Itens selecionados'
		finishBtn.disabled = selected.length === 0
		updateSelectionButtons()
	}

	function findSelectedIndexByName(name){
		return selected.findIndex(i=>i.name===name)
	}

	selectButtons.forEach(btn=>{
		btn.addEventListener('click',()=>{
			const item = btn.closest('.item')
			const name = item.dataset.name
			const price = parseFloat(item.dataset.price||0)
			const idx = findSelectedIndexByName(name)
			if(idx === -1){
				selected.push({name,price,quantity:1})
			} else {
				selected[idx].quantity += 1
			}
			updateCart()
		})
	})

	// remover individual (event delegation)
	cartList.addEventListener('click', (e)=>{
		const button = e.target.closest('button')
		if(!button) return
		const name = button.dataset.name
		const idx = findSelectedIndexByName(name)
		if(button.classList.contains('remove')){
			if(idx > -1){
				selected.splice(idx,1)
				updateCart()
			}
			return
		}
		if(idx === -1) return
		if(button.classList.contains('increase')){
			selected[idx].quantity += 1
			updateCart()
			return
		}
		if(button.classList.contains('decrease')){
			selected[idx].quantity -= 1
			if(selected[idx].quantity < 1){
				selected.splice(idx,1)
			}
			updateCart()
		}
	})

	clearBtn.addEventListener('click',()=>{
		selected.length = 0
		updateCart()
	})

	const whatsappPhone = '5511998535533' // substitua pelo número desejado

	finishBtn.addEventListener('click',()=>{
		if(selected.length===0) return
		const lines = selected.map(it=>{
			const qtyLabel = it.quantity > 1 ? ` x${it.quantity}` : ''
			return `${it.name}${qtyLabel} - ${formatPrice(it.price * it.quantity)}`
		})
		const total = formatPrice(calcTotal())
		const msg = `Olá! Gostaria de fazer um pedido:\n${lines.map(l=>' - '+l).join('\n')}\nTotal: ${total}`
		const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`
		window.open(url, '_blank')
	})

	// menu modal: build list from DOM
	function buildMenuList(){
		menuList.innerHTML = ''
		const categories = document.querySelectorAll('.category')
		categories.forEach(cat=>{
			const heading = cat.querySelector('h2')?.textContent || 'Categoria'
			const div = document.createElement('div')
			div.className = 'menu-category'
			const h4 = document.createElement('h4')
			h4.textContent = heading
			div.appendChild(h4)
			const items = cat.querySelectorAll('.item')
			items.forEach(it=>{
				const name = it.dataset.name
				const price = parseFloat(it.dataset.price||0)
				const row = document.createElement('div')
				row.className = 'menu-item'
				row.innerHTML = `<span>${name} <small style="color:#b85b2e">${formatPrice(price)}</small></span>`
				const addBtn = document.createElement('button')
				addBtn.textContent = 'Adicionar'
				addBtn.addEventListener('click', ()=>{
					const idx = findSelectedIndexByName(name)
				if(idx===-1){ selected.push({name,price,quantity:1}) }
				else { selected[idx].quantity += 1 }
					updateCart()
				})
				row.appendChild(addBtn)
				div.appendChild(row)
			})
			menuList.appendChild(div)
		})
	}

	menuBtn.addEventListener('click', ()=>{
		buildMenuList()
		menuModal.classList.add('open')
		menuModal.setAttribute('aria-hidden','false')
	})
	menuClose.addEventListener('click', ()=>{
		menuModal.classList.remove('open')
		menuModal.setAttribute('aria-hidden','true')
	})
	// close modal when clicking outside panel
	menuModal.addEventListener('click',(e)=>{ if(e.target===menuModal){ menuModal.classList.remove('open'); menuModal.setAttribute('aria-hidden','true') } })

})
