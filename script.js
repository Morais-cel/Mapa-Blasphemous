const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 1,
    zoomControl: false,
    scrollWheelZoom: true,
    maxBounds: [[0,0], [950, 1600]],
});


//Icons

function createicon(url){
    num=30
    return L.icon({
        iconUrl: url,
        iconSize: [num,num],
        iconAnchor: [num/2,num],
    });
}

const saveIcon= createicon("\imagens/Icons/Prie Dieu.png");
const ConfessorIcon= createicon("\imagens/Icons/Confessor Statue.png");
const portalIcon= createicon("\imagens/Icons/Fast Travel.png");
const MeaCulpaIcon= createicon("\imagens/Icons/Mea Culpa.png");
const SanguineIcon= createicon("\imagens/Icons/Sanguine Fountain.png");
const LadyIcon= createicon("\imagens/Icons/Six Sorrows Lady.png");
const FountainIcon= createicon("\imagens/Icons/Oil Fountain.png");
const QuicksilverIcon= createicon("\imagens/Icons/Quicksilver.png");
const EmptyBileIcon= createicon("\imagens/Icons/Empty Bile Vessel.webp");
const ChildIcon= createicon("\imagens/Icons/Children of Light.webp")

//Camadas de itens presentes no mapa

const bounds = [[0, 0], [864, 1472]];

const imgURL='\imagens/complete_map.webp';

L.imageOverlay(imgURL,bounds).addTo(map);
map.fitBounds(bounds);

const Savepoint_Layer= L.layerGroup().addTo(map);
const Confessor_Statue_Layer= L.layerGroup().addTo(map);
const Fast_Travel_Layer= L.layerGroup().addTo(map);const Sanguine_Fountain_Layer= L.layerGroup().addTo(map);
const MeaCulpa_shrine_layer= L.layerGroup().addTo(map);
const Lady_Sorrows_Layer= L.layerGroup().addTo(map);
const Oil_Fountain_Layer= L.layerGroup().addTo(map);
const Empty_Bile_layer= L.layerGroup().addTo(map);
const Quicksilver_layer= L.layerGroup().addTo(map);
const Child_of_light_layer= L.layerGroup().addTo(map);

function getSavedState()
{
    const savestateJSON= localStorage.getItem('BlasphemousMapState');
    return savestateJSON ? JSON.parse(savestateJSON) : {};
}

function saveState(state)
{
    localStorage.setItem('BlasphemousMapState', JSON.stringify(state));
}

let collectedState= getSavedState();

function popup_struct(title, desc, id, ref)
{
    const structure= document.createElement('div')
    const title_elem= document.createElement('h2');
    const desc_elem= document.createElement('p');

    L.DomUtil.addClass(structure, "popup")

    title_elem.innerText= title;
    desc_elem.innerHTML= desc


    const div_checkbox= document.createElement('div');
    L.DomUtil.addClass(div_checkbox, "div_checkbox");

    const checkbox= document.createElement('input');
    checkbox.type= 'checkbox';
    checkbox.name= `${title}`;
    checkbox.id= `chk-${id}`;

    const label= document.createElement('label');
    label.innerText= "Encontrado";
    label.htmlFor= `chk-${id}`;

    

    if (collectedState[id])
        {
            checkbox.checked= true
        }
    else
        {
            checkbox.checked= false
        }

    checkbox.addEventListener('click', () => {
        if(L.DomUtil.hasClass(ref.getElement(), "mark"))
            {
                L.DomUtil.removeClass(ref.getElement(), "mark");
                L.DomUtil.addClass(ref.getElement(),"non_mark");
                delete collectedState[id];
            }
        else
            {
                L.DomUtil.removeClass(ref.getElement(), "non_mark");
                L.DomUtil.addClass(ref.getElement(), "mark");
                collectedState[id] = true;
            }
        saveState(collectedState);
    });

    structure.appendChild(title_elem);
    structure.appendChild(desc_elem);

    div_checkbox.appendChild(checkbox);
    div_checkbox.appendChild(label);
    structure.appendChild(div_checkbox);

    return structure
}

function create_marker(data, json_part, layer, icon)
{
    const part= data[json_part];
    if(part.locais)
    {
        part.locais.forEach(local => {
        let coords= [bounds[1][0]-local.coords[1],local.coords[0]];

        let title= local.titulo || part.titulo_padrao;
        let desc= local.desc || part.desc_padrao;

        const marker= L.marker(coords, {icon: icon}).addTo(layer)

        const LocalId= local.id;

        if(collectedState[LocalId])
            {
                L.DomUtil.addClass(marker.getElement(), "mark")
            }
    

        marker.on('click', (e) => {
            map.setView(coords, 1);

            L.popup(
                {
                    closeButton: false,
                    keepInView: false,
                    closeOnClick: true,
                }
            )
            .setLatLng([coords[0]+15, coords[1]])
            .setContent(popup_struct(title, desc, LocalId, marker))
            .openOn(map)
            })

        });
    }
    else
    {
        return
    }
}


//Código 

fetch('dados.json')
    .then(response => response.json())
    .then(data => {

        create_marker(data, "savepoints", Savepoint_Layer, saveIcon);

        create_marker(data, "confessor_statue", Confessor_Statue_Layer, ConfessorIcon);

        create_marker(data, "travel_location", Fast_Travel_Layer, portalIcon);

        create_marker(data, "mea_culpa_shrine", MeaCulpa_shrine_layer, MeaCulpaIcon);

        create_marker(data, "flask_upg", Sanguine_Fountain_Layer, SanguineIcon)

        create_marker(data, "life_upg", Lady_Sorrows_Layer, LadyIcon);

        create_marker(data, "fervor_upg", Oil_Fountain_Layer, FountainIcon);

        create_marker(data, "Quicksilver", Quicksilver_layer, QuicksilverIcon)
    })