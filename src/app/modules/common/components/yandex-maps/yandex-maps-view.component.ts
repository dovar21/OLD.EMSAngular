import { Component, Input, OnInit } from "@angular/core";
declare const ymaps: any;

@Component({
    selector: "yandex-maps-view",
    templateUrl: "./yandex-maps-view.component.html",
    styleUrls: ["./yandex-maps-view.component.sass"]
})
export class YandexMapsViewComponent implements OnInit {
    map: any;
    mineMap: any; 

    // -------------------------------------------------------------------------
    // Input/Output
    // -------------------------------------------------------------------------

    @Input()
    location: string;

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        const locationName = this.location;
        ymaps.ready(() => {
            const myMap = new ymaps.Map('map', {
                center: [38.576271, 68.779716],
                zoom: 9,
                controls: []
            });
            this.mineMap = myMap;

            // Поиск координат 'loaction'.
            ymaps.geocode(locationName, { results: 1 }).then(res => {
                // Выбираем первый результат геокодирования.
                const firstGeoObject = res.geoObjects.get(0),
                    // Область видимости геообъекта.
                    bounds = firstGeoObject.properties.get('boundedBy');

                firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');

                // Получаем строку с адресом и выводим в иконке геообъекта.
                firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

                // Добавляем первый найденный геообъект на карту.
                myMap.geoObjects.add(firstGeoObject);
                // Масштабируем карту на область видимости геообъекта.
                myMap.setBounds(bounds, {
                    // Проверяем наличие тайлов на данном масштабе.
                    checkZoomRange: true
                });
            });

            this.fitMapToViewport();
        });
    }

    // Making map full size in content
    fitMapToViewport() {
        this.mineMap.container.fitToViewport();
    }
}
