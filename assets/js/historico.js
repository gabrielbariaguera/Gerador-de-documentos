let notas = {}

document.getElementById("btnSalvarNota").addEventListener("click", () => {
  const materia = document.getElementById("materia").value;
  if (!materia) {
    alert("Selecione uma matéria.");
    return;
  }

  notas[materia] = {
    ano1: +document.getElementById("notaAno1").value || 0,
    ano2: +document.getElementById("notaAno2").value || 0,
    ano3: +document.getElementById("notaAno3").value || 0,
    ano4: +document.getElementById("notaAno4").value || 0,
    ano5: +document.getElementById("notaAno5").value || 0,
  };
  console.log("Dados de notas salvos:", notas); 
})


 