interface Veiculo {
  nome: string;
  placa: string;
  entrada: string | Date;
}

(() => {
  const $ = (query: string): HTMLInputElement | null => 
    document.querySelector(query)
  
  const calcTempo = (mil: number): string => {
    const min = Math.floor(mil/60000)
    const sec = Math.floor(mil%60000/1000)

    return `${min} minutos e ${sec} segundos`
  }

  const patio = () => {
    const ler = (): Veiculo[] => 
      localStorage.patio ? JSON.parse(localStorage.patio) : []
    const salvar = (veiculos: Veiculo[]) =>
      localStorage.setItem('patio', JSON.stringify(veiculos))
    
    const adicionar = (veiculo: Veiculo, salva?: boolean): void => {
      const row = document.createElement('tr')
      row.innerHTML = (
        `<td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}td>
        <td>
          <button class='delete' data-placa='${veiculo.placa}'>X</button>
        </td>
        `
      )

      row.querySelector('.delete')?.addEventListener('click', function() {
        remover(this.dataset.placa as string)
      })

      $('#patio')?.appendChild(row)
      if (salva) 
        salvar([...ler(), veiculo])
    }
    const remover = (placa: string) => {
      const { entrada, nome} = ler().find(veiculo => veiculo.placa === placa)
      const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime())

      if (confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) {
        salvar(ler().filter(veiculo => veiculo.placa !== placa))
        render()
      }
    }
    const render = () => {
      $('#patio')!.innerHTML = ''
      const patio = ler()
      if (patio.length)
        patio.forEach(veiculo => adicionar(veiculo))
    }

    return { ler, adicionar, remover, salvar, render }
  }

  patio().render()
  $('#cadastrar')?.addEventListener('click', () => {
    const nome = $('#nome')?.value
    const placa = $('#placa')?.value

    if (!nome || !placa)
      alert('Os campos "nome" e "placa" são obrigatórios')
    else patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true)
  })

})()