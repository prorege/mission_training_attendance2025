let members = [];

fetch("members.json")
  .then((response) => response.json())
  .then((data) => {
    members = data;
  });

const searchInput = document.getElementById("searchInput");
const weekSelect = document.getElementById("weekSelect");
const memberInfo = document.getElementById("memberInfo");
const checkInButton = document.getElementById("checkInButton");
const statusMessage = document.getElementById("statusMessage");

let selectedMember = null;

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim();
  const matched = members.filter((m) => m.이름.startsWith(keyword));

  if (matched.length === 1) {
    selectedMember = matched[0];
    memberInfo.innerHTML = displayMemberInfo(selectedMember);
    checkInButton.disabled = false;
    statusMessage.textContent = "";
  } else if (matched.length > 1) {
    selectedMember = null;
    memberInfo.innerHTML = matched.map((m, i) => 
      `<div class="suggestion" data-index="${i}">${m.이름} (${m.지역}, ${m.직분}, ${m.부서})</div>`
    ).join("");
    checkInButton.disabled = true;
  } else {
    selectedMember = null;
    memberInfo.innerHTML = "";
    checkInButton.disabled = true;
  }
});

memberInfo.addEventListener("click", (e) => {
  if (e.target.classList.contains("suggestion")) {
    const name = e.target.textContent.split(" ")[0];
    selectedMember = members.find((m) => m.이름 === name);
    memberInfo.innerHTML = displayMemberInfo(selectedMember);
    checkInButton.disabled = false;
  }
});

function displayMemberInfo(member) {
  return `
    <p><strong>이름:</strong> ${member.이름}</p>
    <p><strong>지역:</strong> ${member.지역}</p>
    <p><strong>직분:</strong> ${member.직분}</p>
    <p><strong>부서:</strong> ${member.부서}</p>
  `;
}

checkInButton.addEventListener("click", () => {
  if (!selectedMember) return;
  const selectedWeek = weekSelect.value;

  fetch("https://script.google.com/macros/s/AKfycbzLfjfyhlCkG25MSow7_gwPIeCbzg3xEGe_UMFCs15e_2iWPDDn6JJUfQxlyyugbOlL/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: selectedMember.이름,
      week: selectedWeek
    }),
  });

  statusMessage.textContent = `${selectedWeek} 출석이 기록되었습니다.`;
  checkInButton.disabled = true;
});
