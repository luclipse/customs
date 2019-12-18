<%--
  Class Name : data.jsp
  Description : 데이터 관리 화면
  Modification Information

  author   : 정호경
  since    : 2019.12.05
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>DATA</title>
    <link rel="stylesheet" href="/resources/js/lib/tui.grid/tui-grid.css" type="text/css">
    <link rel="stylesheet" href="/resources/js/lib/bootstrap-4.4.1/css/bootstrap.css" type="text/css">
    <link rel="stylesheet" href="/resources/js/lib/bootstrap-4.4.1/css/sidebar.css" type="text/css">
</head>

<body onload="init()">
    <header class="navbar navbar-dark bg-dark" style="height: 7vh;margin-bottom:0px">
        <div class="navbar-nav-scroll">
            <ul class="navbar-nav bd-navbar-nav flex-row">
                <li class="nav-item" style="padding-right: .5rem;padding-left: .5rem;">
                    <a class="nav-link active" href="/map/">MAP</a>
                </li>
                <li class="nav-item" style="padding-right: .5rem;padding-left: .5rem;">
                    <a class="nav-link active" href="/data/">DATA</a>
                </li>
            </ul>
        </div>
    </header>
    <div class="container">
        <br>
        <h1>데이터</h1>
        <br>
        <div class="card">
            <div class="card-body">
                <div id="dataGrid"></div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-primary" id="btn-dat-card" onclick="toggleDatGrid()">새로운 데이터</button>
                <button type="button" class="btn btn-primary" id="btn-upload-card" onclick="toggleUploadGrid()">파일 업로드</button>
                <button type="button" class="btn btn-primary" id="btn-dat-delete" onclick="deleteDat()">데이터 삭제</button>
            </div>
        </div>
        <br>
        <div id="div-dat-grid" class="card" style="display: none">
            <form>
                <div class="card-body">
                    <label for="input-datNm">데이터명</label><input type="text" class="form-control" id="input-datNm" name="datNm"/>
                    <label for="input-datDesc">데이터설명</label><input type="text" class="form-control" id="input-datDesc" name="datDesc"/>
                    <label for="input-tblNm">테이블명</label><input type="text" class="form-control" id="input-tblNm" name="tblNm"/>
                </div>
                <div class="card-footer">
                    <button id="btn-saveDat" class="btn btn-primary"  onclick="saveDat({'datNm' : 'input-datNm', 'datDesc' : 'input-datDesc', 'tblNm' : 'input-tblNm'})">
                        데이터 입력
                    </button>
                </div>
            </form>
        </div>
        <div id="div-upload-grid" class="card" style="display: none">
            <form method="post" action="" enctype="multipart/form-data" id="zipFileUploadForm">
                <div class="card-body">
                <ol>
                    <li>
                        <label>
                            <span>SRID : </span>
                            <input type="text" id="input-srid" name="srid"><br>
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>업로드할 파일</span>
                            <input type="file" accept="application/zip" id="zipFile" name="zipFile"><br>
                        </label>
                    </li>
                </ol>
                </div>
                <div class="card-footer">
                    <button id="btn-zipFileUpload" class="btn btn-primary"  onclick="zipFileUpload(saveFileToDat, fileApiAlert, cbSaveDat)">
                        파일 업로드
                    </button>
                </div>
            </form>

        </div>
    </div>
</body>
<script>
    var serverMapHost = '${serverMapHost}';
    var serverMapCmmHost = '${serverMapCmmHost}';
    var serverFileHost = '${serverFileHost}';
</script>
<script type="text/javascript" src="/resources/js/lib/jquery/jquery-1.12.4.js"></script>
<script type="text/javascript" src="/resources/js/lib/jquery-sidebar/jquery.sidebar.js"></script>
<script type="text/javascript" src="/resources/js/lib/tui.grid/tui-grid.js"></script>
<script type="text/javascript" src="/resources/js/lib/bootstrap-4.4.1/js/bootstrap.js"></script>
<script type="text/javascript" src="/resources/js/HashMap.js"></script>
<script type="text/javascript" src="/resources/js/cmm/cmmApi.js"></script>
<script type="text/javascript" src="/resources/js/file/fileApi.js"></script>
<script type="text/javascript" src="/resources/js/lib/zip/zip.js"></script>
<script type="text/javascript" src="/resources/js/lib/zip/zip-ext.js"></script>
<script type="text/javascript" src="/resources/js/view/data.js"></script>
</html>
