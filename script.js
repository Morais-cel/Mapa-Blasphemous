const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 1,
    zoomControl: false,
    scrollWheelZoom: true,
    maxBounds: [[-100,-100], [950, 1600]],
});


//Icons

function createicon(url){
    num=30;
    return L.icon({
        iconUrl: url,
        iconSize: [num,num],
        iconAnchor: [num/2,num],
    });
}

const saveIcon= createicon("imagens/Icons/Prie Dieu.png");
const ConfessorIcon= createicon("imagens/Icons/Confessor Statue.png");
const portalIcon= createicon("imagens/Icons/Fast Travel.png");
const MeaCulpaIcon= createicon("imagens/Icons/Mea Culpa.png");
const SanguineIcon= createicon("imagens/Icons/Sanguine Fountain.png");
const LadyIcon= createicon("imagens/Icons/Six Sorrows Lady.png");
const FountainIcon= createicon("imagens/Icons/Oil Fountain.png");
const QuicksilverIcon= createicon("imagens/Icons/Quicksilver.png");
const EmptyBileIcon= createicon("imagens/Icons/Empty Bile Vessel.png");
const ChildIcon= createicon("imagens/Icons/Children of Light.png")
const RelicIcon= createicon("imagens/Icons/Relics.png");
const BossesIcon= createicon("imagens/Icons/Bosses.png");

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
const Relics_layer= L.layerGroup().addTo(map);
const Bosses_layer= L.layerGroup().addTo(map);

const Layers= {
    "Prie Dieu": Savepoint_Layer,
    "Estátua do Confessor": Confessor_Statue_Layer,
    "Portal de Viagem Rápida": Fast_Travel_Layer,
    "Fontes Sanguíneas": Sanguine_Fountain_Layer,
    "Altar de Mea Culpa": MeaCulpa_shrine_layer,
    "Dama das Seis Dores": Lady_Sorrows_Layer,
    "Óleo dos Peregrinos": Oil_Fountain_Layer,
    "Mercúrio": Quicksilver_layer,
    "Filhos do Luar": Child_of_light_layer,
    "Vaso Biliar Vazio": Empty_Bile_layer,
    "Relíquias": Relics_layer,
    "Chefes": Bosses_layer
}

const categoryConfig = {
    "savepoints": 
    {
        textElement: document.getElementById('savepoints_counter_text'),
        barElement: document.getElementById('c_prie_dieu'),
        checkbox: document.getElementById('f_prie_dieu')
    },
    "confessor_statue": 
    {
        textElement: document.getElementById('confessor_statue_counter_text'),
        barElement: document.getElementById('c_confessor_statue'),
        checkbox: document.getElementById('f_confessor_statue')
    },
    "travel_location": 
    {
        // Corrigi seu typo 'tex' para 'text' no getElementById
        textElement: document.getElementById('travel_location_counter_text'), 
        barElement: document.getElementById('c_travel_location'),
        checkbox: document.getElementById('f_travel_location')
    },
    "mea_culpa_shrine": 
    {
        textElement: document.getElementById('mea_culpa_shrine_counter_text'),
        barElement: document.getElementById('c_mea_culpa_shrine'),
        checkbox: document.getElementById('f_mea_culpa_shrine')
    },
    "life_upg": 
    {
        textElement: document.getElementById('life_upg_counter_text'),
        barElement: document.getElementById('c_lady_six_sorrows'),
        checkbox: document.getElementById('f_lady_six_sorrows')
    },
    "fervor_upg": 
    {
        textElement: document.getElementById('fervor_upg_counter_text'),
        barElement: document.getElementById('c_pilgrins_oil'),
        checkbox: document.getElementById('f_pilgrins_oil')
    },
    "flask_upg": 
    {
        textElement: document.getElementById('flask_upg_counter_text'),
        barElement: document.getElementById('c_sanguine_fountain'),
        checkbox: document.getElementById('f_sanguine_fountain')
    },
    "Quicksilver": 
    {
        textElement: document.getElementById('Quicksilver_counter_text'),
        barElement: document.getElementById('c_quicksilver'),
        checkbox: document.getElementById('f_quicksilver')
    },
    "Child_light": 
    {
        textElement: document.getElementById('Child_light_counter_text'),
        barElement: document.getElementById('c_child_of_light'),
        checkbox: document.getElementById('f_child_of_light')
    },
    "Empty_bile_vessel": 
    {
        textElement: document.getElementById('Empty_bile_vessel_counter_text'),
        barElement: document.getElementById('c_empty_vessel'),
        checkbox: document.getElementById('f_empty_vessel')
    },
    "Relics": 
    {
        textElement: document.getElementById('Relics_counter_text'),
        barElement: document.getElementById('c_relics'),
        checkbox: document.getElementById('f_relics')
    },
    "Bosses": 
    {
        textElement: document.getElementById('Bosses_counter_text'),
        barElement: document.getElementById('c_bosses'),
        checkbox: document.getElementById('f_bosses')
    }
};

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

function popup_struct(title, desc, id, ref, img= null)
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
        };

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
        progress_check();
        console.log(collectedState)
    });

    if (img != null)
    {
        const img_element= document.createElement("img");
        img_element.src= img
        structure.appendChild(img_element);
    }


    structure.appendChild(title_elem);
    structure.appendChild(desc_elem);

    div_checkbox.appendChild(checkbox);
    div_checkbox.appendChild(label);
    structure.appendChild(div_checkbox);

    return structure
};

function create_marker(data, json_part, layer, icon)
{
    const part= data[json_part];
    if (part.locais)
    {
        part.locais.forEach(local => {
        const coords= [bounds[1][0]-local.coords[1],local.coords[0]];

        const title= local.titulo || part.titulo_padrao;
        const desc= local.desc || part.desc_padrao;

        const marker= L.marker(coords, {icon: icon}).addTo(layer)

        const LocalId= local.id;

        if(collectedState[LocalId])
            {
                L.DomUtil.addClass(marker.getElement(), "mark")
            }
    

        marker.on('click', (e) => {

            const latlon= e.latlng;
            map.setView(latlon, 0.5)

            if (local.img || part.img_padrao)
            {
                const img= local.img || part.img_padrao;
                L.popup(
                {
                    closeButton: false,
                    keepInView: false,
                    closeOnClick: true,
                    autoPan: false,
                })
                .setLatLng([coords[0]+15, coords[1]])
                .setContent(popup_struct(title, desc, LocalId, marker, img))
                .openOn(map)
            }
            else
            {
                L.popup(
                {
                    closeButton: false,
                    keepInView: false,
                    closeOnClick: true,
                    autoPan: false
                })
                .setLatLng([coords[0]+15, coords[1]])
                .setContent(popup_struct(title, desc, LocalId, marker))
                .openOn(map)
            }
        })

        });
    }
    else
    {
        return
    }
};

function progress_check()
{
    if (!mapdata.savepoints) return;

    for (const categoryKey in categoryConfig)
    {
        const config= categoryConfig[categoryKey];
        const categoryData= mapdata[categoryKey];

        if (categoryData && categoryData.locais)
        {
            const total= categoryData.locais.length;
            let current= 0;

            categoryData.locais.forEach(local =>
            {
                if (collectedState[local.id])
                {
                    current++;
                }                

                total_percent= (current/total)*100;

                config.textElement.innerText=`${current}/${total}`;
                config.barElement.children[0].style.width= `${total_percent}%`;
            });
        }
    }
};

function open_menu(e)
{
    const menu_container= document.getElementById("container_filter_menu");
    const object_menu= document.getElementById("filter");
    const closer_button= document.getElementById("button_filter_menu")

    if (L.DomUtil.hasClass(object_menu, "filter_menu_hidden"))
    {
        L.DomUtil.removeClass(object_menu, "filter_menu_hidden");
        object_menu.onclick= null;
        object_menu.title="";
        closer_button.style.display= "flex";

        menu_container.style.margin= "20px";
    }
    else
    {
        L.DomUtil.addClass(object_menu, "filter_menu_hidden");
        object_menu.onclick= open_menu;
        object_menu.title= "Abrir menu de filtros";
        closer_button.style.display= "none";

        menu_container.style.margin= "10px";
    };
};

function remove_layer(e)
{
    const Layer_att= e.target.name;
    const show_all= document.getElementById("show_layers");
    const hide_all= document.getElementById("hide_layers");
    show_all.checked= false;
    hide_all.checked= false;
    show_all.disabled= false;
    hide_all.disabled= false;
    
    if (!e.target.checked)
        {
            map.removeLayer(Layers[Layer_att]);
        }
    else
        {
            map.addLayer(Layers[Layer_att]);
        };
    
    filter_control(e);
};

function filter_control(e)
{
    const show_all= document.getElementById("show_layers");
    const hide_all= document.getElementById("hide_layers");
    const event_triger= e.target;
    let check_all_aux= true;
    let uncheck_all_aux= true;

    if (event_triger==show_all && show_all.checked)
    {
        hide_all.checked= false;
        hide_all.disabled= false;
        show_all.disabled= true;

        Object.entries(Layers).forEach(([key, layer])=> {
            map.addLayer(layer);

            checkbox_by_name= document.getElementsByName(key);
            checkbox_by_name.forEach((element) => {
                element.checked=true
            });
        });
    }
    else if (event_triger==hide_all && hide_all.checked)
    {
        show_all.checked= false;
        show_all.disabled= false;
        hide_all.disabled= true

        Object.entries(Layers).forEach(([key, layer])=> {
            map.removeLayer(layer);

            checkbox_by_name= document.getElementsByName(key);
            checkbox_by_name.forEach((element) => {
                element.checked=false
            });
        });
    }

    for (const categoryKey in categoryConfig)
    {
        const element= categoryConfig[categoryKey];
        if (!element.checkbox.checked)
        {
            check_all_aux= false;
            break;
        };
    };

    for (const categoryKey in categoryConfig)
    {
        const element= categoryConfig[categoryKey];
        if (element.checkbox.checked)
        {
            uncheck_all_aux= false;
            break;
        };
    };

    if (check_all_aux)
    {
        show_all.disabled= true;
        show_all.checked= true
    };

    if (uncheck_all_aux)
    {
        hide_all.disabled= true;
        hide_all.checked= true
    };
}

//Código 

let mapdata= {};

fetch('dados.json')
    .then(response => response.json())
    .then(data => {

        mapdata=data;

        progress_check();

        create_marker(data, "savepoints", Savepoint_Layer, saveIcon);

        create_marker(data, "confessor_statue", Confessor_Statue_Layer, ConfessorIcon);

        create_marker(data, "travel_location", Fast_Travel_Layer, portalIcon);

        create_marker(data, "mea_culpa_shrine", MeaCulpa_shrine_layer, MeaCulpaIcon);

        create_marker(data, "flask_upg", Sanguine_Fountain_Layer, SanguineIcon)

        create_marker(data, "life_upg", Lady_Sorrows_Layer, LadyIcon);

        create_marker(data, "fervor_upg", Oil_Fountain_Layer, FountainIcon);

        create_marker(data, "Quicksilver", Quicksilver_layer, QuicksilverIcon);

        create_marker(data, "Child_light", Child_of_light_layer, ChildIcon);

        create_marker(data, "Empty_bile_vessel", Empty_Bile_layer, EmptyBileIcon);

        create_marker(data, "Relics", Relics_layer, RelicIcon);

        create_marker(data, "Bosses", Bosses_layer, BossesIcon)

    })