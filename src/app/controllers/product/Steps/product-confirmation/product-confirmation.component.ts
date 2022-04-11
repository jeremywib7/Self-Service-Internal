import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../../../model/Product/Product";
import {Router} from "@angular/router";
import {ProductCarrousel} from "../../../../model/Product/ProductCarrousel";
import {Galleria} from "primeng/galleria";
import {ProductService} from "../../../../service/product.service";

@Component({
    selector: 'app-product-confirmation',
    templateUrl: './product-confirmation.component.html',
    styleUrls: ['./product-confirmation.component.scss']
})
export class ProductConfirmationComponent implements OnInit {

    images: any[];

    showThumbnails: boolean;

    fullscreen: boolean = false;

    activeIndex: number = 0;

    onFullScreenListener: any;

    @ViewChild('galleria') galleria: Galleria;

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    productInfo: any;

    productCarrousel: any;

    constructor(public productModel: Product, private router: Router, private cd: ChangeDetectorRef, private productService:
        ProductService) {
    }

    ngOnInit(): void {
        this.productInfo = this.productModel.productInformation;
        if (this.productModel.detailInformationDone === false || this.productModel.priceInformationDone === false) {
            this.router.navigate(['pages/product']).then();
        } else {
            this.images = this.productModel.productCarrousel;

            this.bindDocumentListeners();
        }
    }

    onThumbnailButtonClick() {
        this.showThumbnails = !this.showThumbnails;
    }

    toggleFullScreen() {
        if (this.fullscreen) {
            this.closePreviewFullScreen();
        } else {
            this.openPreviewFullScreen();
        }

        this.cd.detach();
    }

    openPreviewFullScreen() {
        let elem = this.galleria.element.nativeElement.querySelector(".p-galleria");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem['mozRequestFullScreen']) { /* Firefox */
            elem['mozRequestFullScreen']();
        } else if (elem['webkitRequestFullscreen']) { /* Chrome, Safari & Opera */
            elem['webkitRequestFullscreen']();
        } else if (elem['msRequestFullscreen']) { /* IE/Edge */
            elem['msRequestFullscreen']();
        }
    }

    onFullScreenChange() {
        this.fullscreen = !this.fullscreen;
        this.cd.detectChanges();
        this.cd.reattach();
    }

    closePreviewFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document['mozCancelFullScreen']) {
            document['mozCancelFullScreen']();
        } else if (document['webkitExitFullscreen']) {
            document['webkitExitFullscreen']();
        } else if (document['msExitFullscreen']) {
            document['msExitFullscreen']();
        }
    }

    bindDocumentListeners() {
        this.onFullScreenListener = this.onFullScreenChange.bind(this);
        document.addEventListener("fullscreenchange", this.onFullScreenListener);
        document.addEventListener("mozfullscreenchange", this.onFullScreenListener);
        document.addEventListener("webkitfullscreenchange", this.onFullScreenListener);
        document.addEventListener("msfullscreenchange", this.onFullScreenListener);
    }

    unbindDocumentListeners() {
        document.removeEventListener("fullscreenchange", this.onFullScreenListener);
        document.removeEventListener("mozfullscreenchange", this.onFullScreenListener);
        document.removeEventListener("webkitfullscreenchange", this.onFullScreenListener);
        document.removeEventListener("msfullscreenchange", this.onFullScreenListener);
        this.onFullScreenListener = null;
    }

    ngOnDestroy() {
        this.unbindDocumentListeners();
    }

    galleriaClass() {
        return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
    }

    fullScreenIcon() {
        return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
    }

    complete() {
        this.productModel.complete();
    }

    prevPage() {
        if (this.router.url.includes("/add")) {
            this.router.navigate(['pages/product/add/image']);
        } else if (this.router.url.includes("/edit")) {
            this.router.navigate(['pages/product/edit/image']);
        }
    }

}
