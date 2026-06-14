document.addEventListener('DOMContentLoaded',()=>{
	const selectButtons = document.querySelectorAll('.select-btn')
	const cartList = document.getElementById('cart-list')
	const finishBtn = document.getElementById('finish-btn')
	const clearBtn = document.getElementById('clear-btn')
	const cartTotalEl = document.getElementById('cart-total')
	const menuBtn = document.getElementById('menu-btn')
	const menuModal = document.getElementById('menu-modal')
	const menuClose = document.getElementById('menu-close')
	const menuList = document.getElementById('menu-list')

	const selected = [] // array of {name, price}

	function formatPrice(v){
		return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
	}

	function calcTotal(){
		return selected.reduce((s,it)=>s+it.price,0)
	}

	function updateCart(){
		cartList.innerHTML = ''
		selected.forEach((it,i)=>{
			const li = document.createElement('li')
			li.innerHTML = `${it.name} - ${formatPrice(it.price)} <button class="remove" data-name="${it.name}">x</button>`
			cartList.appendChild(li)
		})
		const total = calcTotal()
		cartTotalEl.textContent = formatPrice(total)
		finishBtn.disabled = selected.length === 0
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
				selected.push({name,price})
				btn.classList.add('selected')
				btn.textContent = 'Selecionado'
			} else {
				selected.splice(idx,1)
				btn.classList.remove('selected')
				btn.textContent = 'Selecionar'
			}
			updateCart()
		})
	})

	// remover individual (event delegation)
	cartList.addEventListener('click', (e)=>{
		if(e.target.classList.contains('remove')){
			const name = e.target.dataset.name
			const idx = findSelectedIndexByName(name)
			if(idx>-1) selected.splice(idx,1)
			// toggle button state on page
			const btn = document.querySelector(`.item[data-name="${CSS.escape(name)}"] .select-btn`)
			if(btn){ btn.classList.remove('selected'); btn.textContent='Selecionar' }
			updateCart()
		}
	})

	clearBtn.addEventListener('click',()=>{
		selected.length = 0
		selectButtons.forEach(b=>{b.classList.remove('selected'); b.textContent='Selecionar'})
		updateCart()
	})

	const whatsappPhone = '5511999999999' // substitua pelo número desejado

	finishBtn.addEventListener('click',()=>{
		if(selected.length===0) return
		const lines = selected.map(it=>`${it.name} - ${formatPrice(it.price)}`)
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
					if(idx===-1){ selected.push({name,price}) }
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
